const express = require("express");
const connectDB = require("./config/database");
const userModel = require("./model/user");

// const { authAdmin, authUser } = require("./middlewares/auth");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new userModel(req.body);

  try {
    await user.save();
    res.send("User sign up successfully");
  } catch (e) {
    res.send("Error occured: " + e.message);
  }
});

app.get("/users", async (req, res) => {
  const emailId = req.body.email;
  const users = await userModel.find({ email: emailId });

  try {
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (e) {
    res.status(401).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  const users = await userModel.find({});

  try {
    if (users.length === 0) {
      res.status(404).send("Oops! users not found");
    } else {
      res.send(users);
    }
  } catch (e) {
    res.status(401).send("Something went wrong");
  }
});

app.get("/userid", async (req, res) => {
  const userID = req.body.userID;
  console.log(userID);

  try {
    const user = await userModel.findById({ _id: userID });

    res.send(user);
  } catch (e) {
    res.status(401).send("something went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await userModel.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (e) {
    res.status(401).send("something went wrong");
  }
});

app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await userModel.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated successfully");
  } catch (e) {
    res.status(401).send("something went wrong");
  }
});

app.patch("/newUpdate", async (req, res) => {
  const {email,age} = req.body;

  

  try {
    const user = await userModel.findOneAndUpdate({ email: email }, {age:age});
    res.send("user updated successfully");
  } catch (e) {
    res.status(401).send("something went wrong");
  }
});

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
