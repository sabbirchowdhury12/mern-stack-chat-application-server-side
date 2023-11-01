const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODMAIL_USER,
      pass: process.env.NODMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: "sabbir01726740854@gmail.com", // sender address
    to: email,
    subject: "Reset your password", // Subject line
    html: `<p>Your Chat Application OTP is: ${otp}</p>`, // plain text body
  });

  transporter.sendMail(info, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent", info.messageId);
    }
  });
};
