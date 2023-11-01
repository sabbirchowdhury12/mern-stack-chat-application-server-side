const {
  register,
  login,
  setProfile,
  getAllUsers,
  sendToken,
  resetPassword,
} = require("../contollers/userController");
const { verfyJWT } = require("../helpers/jwtMidleware");
const router = require("express").Router();

//register route
router.post("/register", register);

//login route
router.post("/login", login);

//reset email password
router.post("/send-token", sendToken);

router.post("/resetPassword", resetPassword);

//set profile
router.post("/profile/:id", setProfile);

//getAllUser
router.get("/allusers/:id", getAllUsers);

module.exports = router;
