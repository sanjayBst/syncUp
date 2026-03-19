const express = require("express");
const { authUser } = require("../middlewares/auth");
const connectionRouter = express.Router();

connectionRouter.post("/sendConnection", authUser, (req, res) => {
  const user = req.user;

  res.send(user.firstName + " Initiated Handshake");
});

module.exports =  connectionRouter ;
