const bcrypt = require('bcrypt');
const User = require('../models/userModal');


module.exports.register = async (req, res, next) => {

    try {
        const { userName, email, password } = req.body;

        const CheckUserName = await User.findOne({ userName });
        const CheckUserEmail = await User.findOne({ email });

        if (CheckUserName) {
            return res.json({ message: "Username Already Exit, Try Another One.", status: false });
        }
        if (CheckUserEmail) {
            return res.json({ message: "User  Email Already Exit, Try Another One.", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            userName,
            email,
            password: hashedPassword
        };

        const result = await User.create(user);

        delete user.password;

        return res.json({ user, status: true });
    }
    catch (err) {
        next(err);
        console.log(err);
    }

};