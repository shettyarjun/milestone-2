import dotenv from "dotenv";
import session from "express-session";
import userroute from "./route/userroute.js";
import foodroute from "./route/foodroute.js";
import orderroute from "./route/orderroute.js";
import authroute from "./route/authroute.js";
import verifyroute from "./route/verifyroute.js";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import User from "./model/user.js";


dotenv.config();

//middleware
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Express session middleware
app.use(
    session({
        secret: "arjun",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.resolve("./pages"));


app.get("/", (req, res) => {
    console.log("hello");
    res.render("home.ejs");
  });

  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });
  
  app.get("/feedbackpage", (req, res) => {
    res.render("feedbackpage.ejs");
  });

  app.get("/register", (req, res) => {
    res.render("register.ejs");
  });
  // Route for rendering the map page
  app.get("/track-order", (req, res) => {
    // Render the map page
    res.render("map");
  });

  app.get("/homepage", async function (req, res) {
    try {
      let foundUsers = await User.find({ secret: { $ne: null } });
      if (foundUsers) {
        console.log(foundUsers);
        res.render("homepage.ejs", { usersWithSecrets: foundUsers });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  

app.use("/api", authroute);
app.use("/api", foodroute);
app.use("/api", orderroute);
app.use("/api", userroute);
app.use("/api", verifyroute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});