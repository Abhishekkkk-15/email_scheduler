import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jangidabhishek276@gmail.com", 
    pass: "wihb dagq jfys xgne" 
  }
});

// Send email function
export const sendEmail = async ({ to, subject, body }) => { 
  const mailOptions = {
    from: "jangidabhishek276@gmail.com",
    to,
    subject:subject || "unknown",
    html: `<p>${body}</p>`
  };

  await transporter.sendMail(mailOptions);
};


