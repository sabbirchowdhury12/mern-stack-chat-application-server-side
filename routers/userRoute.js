const { register, login, setProfile, getAllUsers, emailSend, resetPassword } = require('../contollers/userController');
const router = require('express').Router();

//register route
router.post('/register', register);

//login route
router.post('/login', login);

//reset email password
router.post('/email', emailSend);

router.post('/resetPassword', resetPassword);

//set profile
router.post('/profile/:id', setProfile);

//getAllUser
router.get('/allusers/:id', getAllUsers);

module.exports = router;