const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
    },
    about: {
      type: String,
      default: "Born to Shine",
      maxLength: 50,
    },
    photoUrl: {
      type: String,
      default: function () {
        if (this.gender === "Male") {
          return "https://shorturl.at/2naqt";
        } else if (this.gender === "Female") {
          return "https://shorturl.at/sCDVM";
        }
      },
    },
    skills: {
      type: [String],
      
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
