import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import randomize from 'randomatic';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../model/user.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASSWORD
    },
});


router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/auth/google/secrets",
    passport.authenticate("google", {
        successRedirect: "/homepage",
        failureRedirect: "/login",
    })
);


passport.use(
    'local',
    new LocalStrategy(async (email, password, cb) => {
        try {
            const user = await User.findOne({ email });

            if (user) {
                const valid = await bcrypt.compare(password, user.password);
                return valid ? cb(null, user) : cb(null, false);
            } else {
                return cb(null, false, { message: 'User not found' });
            }
        } catch (err) {
            console.error(err, 'local error');
            return cb(err);
        }
    })
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/auth/google/secrets",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                console.log(accessToken);
                console.log(profile);
                const user = await User.findOne({ email: profile.email });

                if (!user) {
                    const newUser = new User({
                        email: profile.email,
                        googleId: profile.id,
                    });
                    await newUser.save();
                    return cb(null, newUser);
                } else {
                    return cb(null, user);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, String(user._id));
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await User.findById(id);
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

  
  router.post('/submit', async (req, res) => {
    if (req.isAuthenticated()) {
      console.log(req.body);
      console.log(req.user, 'user');
  
      try {
        if (!req.body || !req.body.secret)
          return res.status(400).json({ error: 'Bad Request. Missing secret in request body.' });
  
        const updatedUser = await User.findOneAndUpdate(
          { googleId: req.user.googleId },
          { $set: { feedback: req.body.secret } },
          { new: true }
        );
  
        console.log(updatedUser, 'updatedUser');
        res.send('feedback updated');
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

router.post('/register', async (req, res) => {
    const { username: email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) return res.redirect('/login');

        const otp = randomize('0', 6);
        console.log("OTP is ", otp);
        const mailOptions = {
            from: process.env.GOOGLE_MAIL,
            to: email,
            subject: 'OTP for Registration',
            text: `Your OTP for registration is: ${otp}`,
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const hash = await bcrypt.hash(password, Number(process.env.SALTROUNDS) || 10);
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                password: hash,
                otp,
            });

            await newUser.save();
            res.redirect('/login');
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;