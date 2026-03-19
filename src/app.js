const express = require("express");

const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const  authRouter  = require("./routes/auth");
const  profileRouter  = require("./routes/profile");
// console.log('working');
const  connectionRouter  = require("./routes/connection");


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);

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
