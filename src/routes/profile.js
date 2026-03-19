const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");

profileRouter.get("/profile", authUser, (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (e) {
    res.send("Error: " + e.message);
  }
});

module.exports = profileRouter;
