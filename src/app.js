const express = require("express");
const connectDB = require("./config/database");
const userModel = require("./model/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  // console.log("1. Signup route hit!");

  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await user.save();
    res.send("User sign up successfully");
  } catch (e) {
    res.send("Error occured: " + e.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    // console.log("Hit");

    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    // console.log(user);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (isPassValid) {
      const token = await user.getJWT();
      res.cookie("token", token);

      res.send("Login Success");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(401).send("Something went wrong");
  }
});

app.get("/profile", authUser, (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (e) {
    res.send("Error: " + e.message);
  }
});

app.post("/sendConnection", authUser, (req, res) => {
  const user = req.user;

  res.send(user.firstName + " Initiated Handshake");
});

connectDB()
  .then(() => {
    console.log("Connection established");
    app.listen(2000, () => {
      console.log("Server is running on port 2000");
    });
  })
  .catch((e) => {
    console.error("Error ");
  });
