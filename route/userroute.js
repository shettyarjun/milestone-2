import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import Order from '../model/order.js';
import User from '../model/user.js';
import passport from 'passport';


dotenv.config();
const router = express.Router();

router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/homepage",
      failureRedirect: "/login",
    })
  );



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Handle the POST request to submit feedback
router.post("/feedback", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'textFile', maxCount: 1 }]), async function (req, res) {
    try {
        console.log(req.files);
        console.log(req.body);

        // Extract necessary data from the request body
        const orderId = req.body.orderId;
        const feedback = parseInt(req.body.rating, 10); // Get feedback rating from form

        // Check if the files are provided in the request
        if (!req.files || !req.files['image'] || !req.files['textFile']) {
            return res.status(400).json({ error: "Image and text file are required" });
        }

        // Find the order by ID
        const order = await Order.findById(orderId);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Set the imageData property of the order to the image path
        order.image = req.files['image'][0].path;
        // Set the textData property of the order to the file path
        order.textData = req.files['textFile'][0].path;

        // Update the order with feedback
        order.feedback = feedback;

        // Save the order with updated data
        await order.save();

        res.send("Feedback submitted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

export default router;
