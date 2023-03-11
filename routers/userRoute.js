const { register, login, setProfile, getAllUsers } = require('../contollers/userController');
const router = require('express').Router();

//register route
router.post('/register', register);

//login route
// router.post('/login', login);

//set profile
router.post('/profile/:id', setProfile);

//getAllUser
router.get('/allusers/:id', getAllUsers);

module.exports = router;