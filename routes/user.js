const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


// SIGNUP ROUTES

router
  .route("/signup")
  // GET signup form
  .get(userController.renderSignupForm)
  // POST signup 
  .post(userController.signup);
// LOGIN ROUTES

router
  .route("/login")
  // GET login form
  .get(userController.renderLoginForm)   
  // POST login
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


// LOGOUT ROUTE

router.get("/logout", userController.logout);

module.exports = router;
