const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  var transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '535c155926253e',
      pass: '0d94447cee56a1',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Matéo G. <mat.guezen@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
