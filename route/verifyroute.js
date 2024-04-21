import express from 'express';
import dotenv from 'dotenv';
import User from '../model/user.js';
import mongoose from 'mongoose';
import Order from '../model/order.js';
import twilio from 'twilio';

dotenv.config();

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);


router.get('/verify-otp', (req, res) => {
    const email = req.query.email;
    res.render('verify-otp.ejs', { email });
});

router.post('/verify-otp', async (req, res) => {
    const email = req.body.email;
    const userOTP = req.body.otp;

    try {
        const user = await User.findOne({ email });
        if (user && user.otp === userOTP) {
            await User.updateOne({ email }, { $set: { otp: null } });
            req.login(user, (err) => {
                if (err) {
                    console.error('Error during login:', err);
                } else {
                    res.redirect('/homepage');
                }
            });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



const otpSchema = new mongoose.Schema({
    phoneNumber: String,
    otp: String,
});

const OtpModel = mongoose.model("OTP", otpSchema);
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

// mobile otp
router.post("/send-motp", async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Generate a random 6-digit OTP
        const otp = generateOTP();

        const otpDocument = new OtpModel({ phoneNumber, otp });
        await otpDocument.save();

        // Send the OTP to the user via SMS
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });

        res.json({ success: true, otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// verify otp
router.post("/verify-motp", async (req, res) => {
    const { orderId, phoneNumber, useOTP } = req.body;

    const order = await Order.findById(orderId);
    try {
        const otpDocument = await OtpModel.findOne({ phoneNumber, otp: useOTP });
        if (otpDocument) {
            order.status = 'completed';
            order.otpConfirmed = true;
            await order.save();
            res.json({ success: true, message: "OTP verified successfully" });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

export default router;