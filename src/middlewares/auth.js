const authAdmin = (req, res, next) => {
  const token = "xyz";
  const isTokenValid = token === "xyz";
  if (!isTokenValid) {
    res.status(401).send("Unauhtorized");
  } else {
    console.log("Admin verified");

    next();
  }
};

const authUser = (req, res, next) => {
  const token = "zxc";
  const isTokenValid = token === "zxc";
  if (!isTokenValid) {
    res.status(401).send("Unauthorized");
  } else {
    console.log("User verified");
    next();
  }
};

module.exports = { authAdmin, authUser };
