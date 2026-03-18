const jwt = require("jsonwebtoken");
const userModel = require("../model/user");

const authUser = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Login Again !!");
    }

    const decoded = await jwt.verify(token, "syncUp@2806#");

    const { _id } = decoded;

    const user = await userModel.findById(_id);

    if (!user) {
      throw new Error("User not found ");
    }
    
    req.user = user;
    

    next();
  } catch (e) {
    res.send("Error: " + e.message);
  }
};

module.exports = { authUser };
