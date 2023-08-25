const nodemailer = require("nodemailer");
// Function to send verification email
const sendVerificationEmail = async (toEmail, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service provider
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: "Verify Your Email",
      html: `
      <p>Hello, please click the link below to verify your email:</p>
      <h1>
      <a href="${verificationLink}">Verify Email</a></h1>
    `,
    });
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = { sendVerificationEmail };