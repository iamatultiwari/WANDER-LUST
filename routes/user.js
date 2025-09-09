const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js");
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


module.exports = router;
