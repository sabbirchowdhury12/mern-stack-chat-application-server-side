const Messages = require('../models/messageModel');


module.exports.addMsg = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const result = await Messages.create({
            message: {
                text: message
            },
            users: [from, to],
            sender: from
        });

        if (result) return res.send({ msg: " message added successfully" });
        else return res.send({ msg: " message added failed" });
    }
    catch (err) {
        next(err);
    }
};


