const { register, login, setProfile } = require('../contollers/userController');
const router = require('express').Router();

//register route
router.post('/register', register);

//login route
router.post('/login', login);

//set profile
router.post('/profile/:id', setProfile);

module.exports = router;