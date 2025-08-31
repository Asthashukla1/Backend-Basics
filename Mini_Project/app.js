const express = require("express");
const app = express();
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const postModel = require("./models/post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logout", function (req, res) {
  res.cookie('token',"");
  res.redirect("/login");
});

app.get("/profile", isLoggedIn, function (req, res) {
  res.cookie('token',"");
  res.redirect("/login");
});

app.post("/register", async function (req, res) {
  try {
    let { username, name, email, age, password } = req.body;

    // check if user exists
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    // hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.status(500).send("Error hashing password");

        let newUser = await userModel.create({
          username,
          email,
          age,
          name,
          password: hash,
        });

        // generate token
        let token = jwt.sign(
          { email: email, userid: newUser._id },
          "shhhhhhh"
        );

        // send token in cookie
        res.cookie("token", token);
        res.send("registered");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/login", async function (req, res) {
  let { username, name, email, age, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("User Not Found");
    
    bcrypt.compare(password, user.password,function(err,result){
      if(result) {
        let token = jwt.sign({email:email,userid:user._id},'shhhhhhh');
        res.cookie('token', token);
        res.status(200).send("you're logged in")
        }
      else res.redirect('/login');
    })
});

function isLoggedIn(req,res,next){
  if(req.cookies.token==='')
    res.send('you are not logged in');
  else{
    let data = jwt.verify(req.cookies.token,"shhhhhhh")
    req.user = data;
    next();
  }
}
function abcd(){
  console.log("its a dummy function");
}

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
