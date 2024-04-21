import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Order from '../model/order.js';
import cron from 'node-cron';


dotenv.config();

const router = express.Router();

router.post("/add-order", async (req, res) => {
  try {
    const { foodId, userId, userAddressId, paymentMode } = req.body;

    // Mock payment processing (replace this with actual payment processing code)
    const paymentDetailsResponse = await fetch("http://localhost:3000/api/mock-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const paymentDetails = await paymentDetailsResponse.json();

    // Create a new order
    const order = new Order({
      foodId,
      userId,
      status: "pending", // Set the initial status as pending
      rating: '',
      image: '',
      textFile: '',
      otpConfirmed: false, // Set OTP confirmation status as false initially
      userAddressId,
      paymentMode,
      invoiceId: paymentDetails.transactionId, // Store invoice ID from payment gateway
      paymentDetails,

    });

    // Save the order to the database
    await order.save();

    res.json({ success: true, message: "Order added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Handle the PUT request for updating order status
router.put("/update-order/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId }, // Change the query to match the document field exactly
      { $set: { status }, $currentDate: { updatedAt: true } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Mock Payment Endpoint
router.post("/mock-payment", async (req, res) => {
  try {
    // Perform mock payment processing (replace this with actual payment processing code)
    const paymentDetails = {
      paymentStatus: "success",
      transactionId: "mock_transaction_id",
    };

    res.json(paymentDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

cron.schedule('*/20 * * * * *', async () => {
  try {
    // Get the date 20 seconds ago
    const twentyAgo = new Date(Date.now() - 60 * 1000);
    const pendingOrders = await Order.find({
      status: 'pending',
      createdAt: { $lte: twentyAgo },
    });

    // Iterate through pending orders and cancel those without confirmation
    for (const order of pendingOrders) {
      // Check if OTP confirmation is not completed
      if (order.otpConfirmed) {
        // If OTP confirmed, set order status to 'confirmed'
        order.status = 'confirmed';
        await order.save();
        console.log(`Order ${order._id} confirmed.`);
      } else {
        // If OTP not confirmed, set order status to 'cancelled'
        order.status = 'cancelled';
        await order.save();
        console.log(`Order ${order._id} cancelled.`);
      }
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});



export default router;