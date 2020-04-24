const express = require("express");
const bodyParser = require("body-parser");
// const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
const engines = require('consolidate');
// const mustache = require('mustache');

const app = express();

// View engine setup
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

  // app.engine("handlebars", exphbs());
  // app.set("view engine", "handlebars");

// Static folder
// app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname)));
app.use(express.static('views'));
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/send", (req, res) => {
  console.log(req.body);
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.langhamerdev.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "test@langhamerdev.com", // generated ethereal user
      pass: "$(Gitlit13)" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <test@langhamerdev.com>', // sender address
    to: "langhamerm@gmail.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // res.render("contact", { msg: "Email has been sent" });
    // res.render("contact");
  });
});
app.listen(3000, () => console.log("http://localhost:3000"));
