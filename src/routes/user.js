const express = require("express");
const { authUser } = require("../middlewares/auth");
const connectionRequestModel = require("../model/connectionRequest");
const userModel = require("../model/user");

const userRouter = express.Router();

const userData = "firstName lastName age photoUrl gender about skills";

userRouter.get("/user/request/pending", authUser, async (req, res) => {
  try {
    // console.log("hit");
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", userData);

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

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", userData)
      .populate("toUserId", userData);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connection Loaded",
      data,
    });
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    // console.log("Hitt");

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(userData)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (e) {
    res.send("Error: " + e.message);
  }
});

module.exports = userRouter;
