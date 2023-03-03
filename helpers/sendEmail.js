// const nodemailer = require("nodemailer")
// require('dotenv').config();

// const { META_PASSWORD } = process.env;

// const nodemailerConfig = {
//     host: 'smtp.meta.ua',
//     port: 465,
//     secure: true,
//     auth: {
//         user: "shpakk2@meta.ua",
//         pass: META_PASSWORD,
//     }
// }

// const transport = nodemailer.createTransport(nodemailerConfig)

// const sendEmail = async (data) => {
//     const email = { ...data, from: "shpakk2@meta.ua" }
//     console.log(META_PASSWORD)
//     console.log(email)
//         await transport.sendMail(email).then(info => console.log(info))
//   .catch(err => console.log(err));

//     return true
// }

const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const { SENGRID_API_KEY } = process.env;

sgMail.setApiKey(SENGRID_API_KEY);

const sendEmail = async (data) => {
    const email = { ...data, from: "shpakk2@gmail.com" }
    await sgMail.send(email)
    return true
}

module.exports = sendEmail