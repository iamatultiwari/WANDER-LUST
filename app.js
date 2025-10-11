if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/WrapAsync.js");

const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session & Flash
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routers
app.use("/", userRouter); // handles /signup, /login, etc.
app.use("/listings", listingsRouter); // must come before reviews router
app.use("/listings/:id/reviews", reviewRouter);

// Stripe Success / Cancel
app.get("/success", (req, res) => {
  res.send("✅ Payment successful! Thank you.");
});

app.get("/cancel", (req, res) => {
  res.send("❌ Payment cancelled.");
});

// 404 Page
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});