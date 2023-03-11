const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const Users = require('../models/userModel');


//register controll

module.exports.register = async (req, res, next) => {
    try {

        const { userName, email, password } = req.body;

        // check email and password 
        const CheckUserName = await Users.findOne({ userName });
        const checkEmail = await Users.findOne({ email });

        if (CheckUserName) {
            return res.json({ message: "User Name Already Exit, Try Another One.", status: false });
        }
        if (checkEmail) {
            return res.json({ message: "User  Email Already Exit, Try Another One.", status: false });
        }

        //secure password
        const hashPassword = await bcrypt.hash(password, 10);

        const user = {
            userName,
            email,
            password: hashPassword
        };

        //delete user password 
        delete user.password;

        const result = await Users.create(user);
        return res.send({ result, user, status: true });

    }

    catch (err) {
        next(err);
    }
};

//login controll
module.exports.login = async (req, res, next) => {

    try {
        const { userName, password } = req.body.user;

        const user = await Users.findOne({ userName });

        if (user) {
            const { password: hashPassword } = user;
            const passwordValidation = await bcrypt.compare(password, hashPassword);
            delete user.password;
            if (passwordValidation) {
                return res.send({ status: true, user });
            }
            return res.json({ status: false, message: 'Invalid password' });
        }

        return res.json({ status: false, message: 'Account does not exit.' });
    }
    catch (error) {
        next(error);
    }
};

//set Profile Image


//get all users
module.exports.getAllUsers = async (req, res, next) => {
    try {

        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "userName",
            "profileImage",
            "_id",
        ]);

        return res.json(users);
    }
    catch (err) {
        next(err);
        console.log(err);
    }
};