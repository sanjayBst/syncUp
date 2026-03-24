const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validation");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (e) {
    res.send("Error: " + e.message);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Edit not allowed");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: "Edits commit successfully",
    });

    // res.send("Done");
  } catch (e) {
    res.status(404).send("Error: " + e.message);
  }
});

module.exports = profileRouter;
