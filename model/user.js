import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        googleId: String,
        otp: String,
    }, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;