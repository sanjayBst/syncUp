const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    "mongodb+srv://sanjayBst:TZTwtfRzBppkRbaX@namastedev.oszppcc.mongodb.net/syncUp";
  await mongoose.connect(uri);
};

module.exports = connectDB;
