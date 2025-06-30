const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // Your Gmail
    pass: process.env.EMAIL_PASS      // App password
  }
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
