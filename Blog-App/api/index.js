//http://localhost:5000/test
//Run cd api and then npx nodemon index.js on terminal (Windows)
//also run npm add cors
//password in momgodb atlas : NXFAfIHHeSzLAzaL
// Visit: https://www.npmjs.com/package/bcrypt for documentation
//On Terminal run :npm add jsonwebtoken
// Visit :https://www.npmjs.com/package/cookie-parser for documentation
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const app = express();
const salt = bcrypt.genSaltSync(saltRounds);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json()); // Add this line to parse JSON in the request body
mongoose.connect(
  "mongodb+srv://vasanthsai1412003:NXFAfIHHeSzLAzaL@cluster0.y9gnbzl.mongodb.net/"
);

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: await hashPassword(password),
      //password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        // Handling the case where the username doesn't exist
        console.log("User not found");
        return res.status(401).json({ message: "Invalid credentials" });
      }
    const passOk = await bcrypt.compare(password, userDoc.password);
    if (passOk) {
      //Logged In
      //res.json();
      jwt.sign(
        { username, id: userDoc._id },
        "yourSecretKeyHere",
        {expiresIn: '1h' },
        (e, token) => {
            if(e) throw e;
            res.cookie('token', token).json({ id:userDoc._id, username});

            console.log("Login successful!");
        }
      );
    } else {
      console.log("Wrong Password");
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

app.get('/profile',(req,res)=>{
  const {token}=req.cookies;
  jwt.verify(token,"yourSecretKeyHere",{},(e,info)=>{
    if(e) throw e;
    res.json(info);
  });
});

app.post('/logout',(req,res)=>{
  res.clearCookie('token').json('ok');
});
app.listen(5000);
//mongosh "mongodb+srv://cluster0.y9gnbzl.mongodb.net/" --apiVersion 1 --username vasanthsai1412003
//mongodb+srv://vasanthsai1412003:<NXFAfIHHeSzLAzaL>@cluster0.y9gnbzl.mongodb.net/
 