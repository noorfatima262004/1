const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

console.log('Email:', process.env.NODEMAILER_EMAIL)
console.log('Password:', process.env.NODEMAILER_PASSWORD)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  debug: true, // Enable debug output
});


const sendEmail = async (mailOptions) => {
  try {
    const response = await transporter.sendMail(mailOptions);

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent!');
  }
};

module.exports = sendEmail;
