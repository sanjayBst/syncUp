const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../model/user");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout successfully");
});

module.exports = authRouter;
