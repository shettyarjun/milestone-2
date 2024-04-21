import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        foodId: String,
        userId: String,
        orderId: String,
        status: String,
        otpConfirmed: Boolean,
        userAddressId: String,
        paymentMode: { type: String, enum: ["cash", "card", "upi"], default: "cash" },
        feedback: {
            type: Number,
            min: 1,
            max: 5,
        },
        image: {
            type: String,
        },
        textData: {
            type: String,
        },
    }, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;