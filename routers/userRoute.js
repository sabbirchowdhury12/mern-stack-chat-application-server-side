const { register, login } = require('../contollers/userController');
const router = require('express').Router();

//register route
router.post('/register', register);

//login route
router.post('/login', login);

module.exports = router;