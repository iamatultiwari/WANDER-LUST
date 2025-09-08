const express =  require ("express"); // Import express
const app = express();
const mongoose = require("mongoose"); // Import mongoose for MongoDB
const Listing = require("./models/listing.js"); // Import the listing model
const path = require("path") // Core Node.js module to handle file paths
// const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";
const methodOverride = require("method-override") // To support PUT & DELETE in forms
const ejsMate = require("ejs-mate") // Layout support for EJS templates

const MONGO_URL ="mongodb://127.0.0.1:27017/AIRBNB"; // MongoDB connection string
const wrapAsync = require("./utils/WrapAsync.js")
const ExpressError= require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")
const session = require("express-session")
const flash = require("connect-flash")


const reviews = require("./routes/review.js");

const listings = require("./routes/listings.js");


// Connect to MongoDB
main().then(() =>{
    console.log("connected to db");
 }).catch(err=> {
    console.log(err);
 });

async function main() {
  await mongoose.connect(MONGO_URL); // Connect to MongoDB
}
// Set EJS as the template engine
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views")) // Set the path for views folder
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(methodOverride("_method")) // Use _method to support PUT/DELETE
app.engine('ejs', ejsMate); // Use ejs-mate for layouts and partials
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires:Date.now() + 7*24*60*1000,
    maxAge: 7*24*60*1000,
    httpOnly: true,
  } 
};
// Root route
app.get("/",(req,res) =>{
    res.send("hii i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
  res.locals.success = req.flash("success"); 
  res.locals.error = req.flash("error"); 
  next();
})



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// for page not found route
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page not found."));
});


app.use((err, req, res, next) => {
    let { statusCode  = 500, message ="Something went wrong."} = err;
    res.status(statusCode).render("error.ejs", {message})
    //res.status(statusCode).send(message);
});
// Start server on port 8000
app.listen(8000, () =>{
    console.log("server is listening on port 8000");
});