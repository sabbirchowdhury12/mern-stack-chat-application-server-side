const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const Token = require("../models/tokenModel");
const { sendEmail } = require("../helpers/emailSend");

//register controll
module.exports.register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    // check email and password
    const CheckUserName = await Users.findOne({ userName });
    const checkEmail = await Users.findOne({ email });

    if (CheckUserName) {
      return res.json({
        message: "User Name Already Exit, Try Another One.",
        status: false,
      });
    }
    if (checkEmail) {
      return res.json({
        message: "User  Email Already Exit, Try Another One.",
        status: false,
      });
    }

    //secure password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = {
      userName,
      email,
      password: hashPassword,
    };

    const result = await Users.create(user);

    user._id = result._id;
    //delete user password
    delete user.password;
    return res.send({ user, status: true });
  } catch (err) {
    next(err);
  }
};

//login
module.exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await Users.findOne({ userName });

    if (user) {
      const passwordValidation = await bcrypt.compare(password, user.password);

      if (!passwordValidation) {
        return res.json({ status: false, message: "Invalid password" });
      }

      const person = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        isProfileImageSet: user.isProfileImageSet,
        profileImage: user.profileImage,
      };
      return res.send({ status: true, person });
    }

    return res.json({ status: false, message: "User name does not exit." });
  } catch (error) {
    next(error);
  }
};

//set Profile Image
module.exports.setProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const profileImage = req.body.profileImage;
    const result = await Users.findByIdAndUpdate(
      id,
      {
        isProfileImageSet: true,
        profileImage,
      },
      { new: true }
    );

    return res.send({
      isSet: result.isProfileImageSet,
      profile: result.profileImage,
    });
  } catch (err) {
    next(err);
  }
};

//generete otp
module.exports.sendToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    let tokenUser = await Token.findOne({ email });
    if (tokenUser) {
      let result = await Token.deleteOne({ email });
    }

    let user = await Users.findOne({ email });
    const responseType = {};
    if (user) {
      let otpCode = Math.floor(Math.random() * 10000 + 1);
      let otpData = {
        email,
        userID: user._id,
        token: otpCode,
      };
      const result = await Token.create(otpData);

      sendEmail(email, otpCode);
      responseType.status = true;

      responseType.message = "Please Check your Email";
    } else {
      responseType.status = false;
      responseType.message = "Invalid email";
    }

    res.status(200).json(responseType);
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    const OTPUser = await Token.findOne({ email });

    const responseType = {};
    if (OTPUser?.token === otp) {
      const user = await Users.findOne({ email });
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      user.save();
      responseType.status = true;
      responseType.message = "Password changed successfully";
    } else {
      responseType.status = false;
      responseType.message = "Invalid OTP";
    }
    res.json(responseType);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // const decoded = req.decoded;
    // console.log(decoded);
    // if (decoded.email !== req.headers.email) {
    //     return res.status(401).send({ message: "anathorizrd access" });
    // }

    const users = await Users.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "userName",
      "profileImage",
      "_id",
    ]);

    return res.json(users);
  } catch (err) {
    next(err);
    console.log(err);
  }
};
