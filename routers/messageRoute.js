// const { addMsg, getAllMsg } = require('../contollers/userController');

const { addMsg, getAllMsg } = require('../contollers/messageController');
const router = require('express').Router();

router.post('/addmsg', addMsg);
router.post('/getallmsg', getAllMsg);

module.exports = router;