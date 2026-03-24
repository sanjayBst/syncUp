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

const validateEditData = (req) => {
  const allowedData = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "gender",
    "photoUrl",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedData.includes(field),
  );
// console.log(isAllowed);

  return isAllowed;
};

module.exports = { validateSignUpData, validateEditData };
