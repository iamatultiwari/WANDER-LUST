const User = require("../models/user.js");

// Show signup form
module.exports.renderSignupForm = (req, res) => {
    console.log("🔥 GET /signup route hit!");
    res.render("users/signup"); 
};

// Handle signup logic
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); 
        console.log(registeredUser);

        // ✅ FIX: changed "resisterUser" → "registeredUser"
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// ✅ FIX: earlier this wrongly pointed to signup
// This is the correct login form renderer
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
