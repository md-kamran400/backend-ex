const UserModel = require("../modles/user.modle");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlackListmodel = require("../modles/token.modle");
const { Router } = require("express");

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    let { email, pass } = req.body;
    const exitingUser = await UserModel.find({ email });
    if (exitingUser.length) {
      return res.status(400).send({
        error: "Registeration Failed. User alreay Exists",
      });
    }
    if (checkPassword(pass)) {
      const hashedPass = bcrypt.hashSync(pass, 10);
      const user = new UserModel({ ...req.body, pass: hashedPass });
      await user.save();
      return res.status(200).send({
        msg: "The new user has been registered",
        registeredUser: { ...req.body, pass: hase },
      });
    }
    return res.status(400).send({
      error:
        "Registration failed! Password should atleas contain one uppercase chatacter, one number & a spacical character",
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});


userRouter.post("/login", async (req, res) => {
  try {
    let { email, pass } = req.body;
    const exitingUser = await UserModel.findOne({ email });
    if (exitingUser) {
      bcrypt.compare(pass, exitingUser.pass, (err, result) => {
        if (result) {
          try {
            const token = jwt.sign({ userID: exitingUser._id }, "masai", {
              expiresIn: 120,
            });
            const refreshToken = jwt.sign(
              { userID: exitingUser._id },
              "masai",
              {
                expiresIn: 300,
              }
            );
            return res
              .status(200)
              .send({ msg: "Login successFull!", token, refreshToken });
          } catch (err) {
            return res.status(400).send({ error: err.message });
          }
        }
        res
          .status(400)
          .send({ error: "Login failed! wrong password is provided." });
      });
    } else res.status(400).send({ error: "Login Failed! Uesr Not Found" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});


userRouter.get("/logout", async () => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;
    if (token) {
      await BlackListmodel.updateMany({}, { $push: { blacklist: [token] } });
      res.status(200).send("Logout successfull!");
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/refreshtoken", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;
    let decoded = jwt.verify(token, "masai");
    let newToken = jwt.sign({ userID: decoded.userID }, "masai", {
      expiresIn: 120,
    });
    res.status(200).send({ newToken });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});



const checkPassword = (pass) => {
  if (pass.length < 8) {
    return false;
  }
  let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let nums = "0123456789";
  let special = "[]{}!@#$%^&*()_+=~`<>?/";
  let flag1 = false;
  let flag2 = false;
  let flag3 = false;

  for (let i = 0; i < pass.length; i++) {
    if (alphabets.includes(pass[i])) {
      flag1 = true;
    }
    true;
    if (nums.includes(pass[i])) {
      flag2 = true;
    }
    if (special.includes(pass[i])) {
      flag3 = true;
    }
  }
  return flag1 && flag2 && flag3 ? true : false;
};

module.exports = userRouter;
