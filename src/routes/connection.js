const express = require("express");
const { authUser } = require("../middlewares/auth");
// const connectionRequest = require("../model/connectionRequest");
const connectionRequestModel = require("../model/connectionRequest");
const userModel = require("../model/user");
const connectionRouter = express.Router();

connectionRouter.post(
  "/sendConnection/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const user = req.user;

      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json("invalid status");
      }

      const userExist = await userModel.findById(toUserId);
      if (!userExist) {
        return res.status(400).json({
          messgae: "user not exists",
        });
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      // console.log("hit");

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request is already exists",
        });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "request sent",
        data,
      });
    } catch (e) {
      res.status(404).json({
        message: "Error: " + e.message,
      });
    }
  },
);

connectionRouter.post(
  "/reviewConnection/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(404).json({
          message: "Invalid Status type",
        });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          messgae: "Connection not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (e) {
      res.status(404).json({
        messgae: "Error" + e.message,
      });
    }
  },
);

module.exports = connectionRouter;
