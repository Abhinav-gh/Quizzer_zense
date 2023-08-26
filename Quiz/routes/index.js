const express = require("express");
const path = require('path');
const { Database, register,login } = require("../database.js");

const router = express.Router(); // Create a new router instance

router.post("/loginaction", function(req, res) {
  let loginDetails = req.body; //req.body is a json object containing username and password
  
  //Checking existence of loginDetails in database
  login(loginDetails, function(err, validDetails) {
    //Condition for valid Login data
    if (validDetails) {

      sess = req.session;

      //stores validDetails of user in session
      sess.userDetails = validDetails;
      //console.log(sess.userDetails.firstname);

      res.redirect("./home.html");
    } else {
      //Asks to Login on failing condition above
      res.send('<div align="center">Invalid Login , Please go back and Re-Enter Details or Register a New Account</div>')
    console.log("invalid login attempt");
    }
  });
});

router.post("/registeraction", function(req, res) {
  const regDetails = req.body; // req.body is a JSON object containing username and password
  register(regDetails, function(decide) {
    if (decide === "success") {
      res.redirect("./login.html");
    } else {
      res.send('<div align="center">User already exists, Please <br><a href="/login">Click Here To Login</a></div>');
    }
  });
});
router.post("/userprofile", function(req, res) {
  
});



module.exports = router; 
