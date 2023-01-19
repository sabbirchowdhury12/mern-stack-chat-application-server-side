const bcrypt = require('bcrypt');
const User = require('../models/userModal');


//register controll
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

//login controll
module.exports.login = async (req, res, next) => {
    try {

        const { userName, email, password } = req.body;

        const user = await User.findOne({ userName });
        if (!user) {
            return res.json({ status: false, message: "Invalid user name or password " });
        }

        const passwordValidation = await bcrypt.compare(password, user.password);
        if (!passwordValidation) {
            return res.json({ status: false, message: "Invalid user name or password " });
        }
        delete user.password;
        return res.json({ status: true, user });
    }
    catch (error) {
        next(error);
    }
};

//set Profile Image
module.exports.setProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const profileImage = req.body.profileImage;

        const result = await User.findByIdAndUpdate(id, {
            isprofileImageSet: true,
            profileImage
        });

        return res.send({
            isSet: result.isprofileImageSet,
            profile: result.profileImage,
        });
    }
    catch (err) {
        next(err);
    }
};

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