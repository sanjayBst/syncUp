const express = require("express");
const { authUser } = require("../middlewares/auth");
const connectionRequestModel = require("../model/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/request/pending", authUser, async (req, res) => {
  try {
      console.log("hit");
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        // status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName age photoUrl gender about skills",
      );

    if (connectionRequests.length === 0) {
      return res.status(200).json({
        message: "No pending connection requests found.",
        data: [],
      });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = userRouter