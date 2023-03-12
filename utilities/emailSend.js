const nodemailer = require("nodemailer");

module.exports.emailSend = async (email, otp) => {

    // console.log(otp);
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODMAIL_USER, // generated ethereal user
            pass: process.env.NODMAIL_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: 'sabbir01726740854@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Reset your password", // Subject line
        // text: `Thank you? ${otp}`,
        html: `<p>Your Chat Application OTP is: ${otp}</p>` // plain text body
    });

    transporter.sendMail(info, function (error, info) {
        if (error) {
            // console.log(error);
        } else {
            // console.log('Email sent', + info.response);
            // console.log('Email sent', + info.messageId);
        }
    });

};