const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid input");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is too weak");
  }
};

module.exports = { validateSignUpData };
