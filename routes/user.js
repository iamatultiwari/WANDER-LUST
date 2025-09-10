const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
// GET signup form
// router.get("/signup", (req, res) => {
//     res.render("users/signup"); // no .ejs
// });
router.get("/signup", (req, res) => {
    console.log("🔥 GET /signup route hit!");
    res.render("users/signup");
});


// POST signup
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to wanderlust");
        // res.redirect("/listings");
        res.redirect("/"); 
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res) => {
    res.render("users/login.ejs")
})
router.post("/login",
    passport.authenticate("local",
         {failureRedirect: '/login',
            failureFlash:true}), 
            (req,res) => {
                // Flash a success message after login
                req.flash("success", "Welcome back to wanderlust!");
                // Redirect to home page after login
                // res.redirect("/"); 
                // res.send("Welcome to wanderlust! u are logged in")
                // res.flash("success", "welcome back to wanderlust!")
                 res.redirect("/listings")
});

router.get("/logout",(req,res) => {
    req.logout((err) => {
        if(err) {
         return   next(err)
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings")
        
    })
})



module.exports = router;
