const express =  require ("express"); // Import express
const app = express();
const mongoose = require("mongoose"); // Import mongoose for MongoDB
const Listing = require("./models/listing.js"); // Import the listing model
const path = require("path") // Core Node.js module to handle file paths
//const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";
const methodOverride = require("method-override") // To support PUT & DELETE in forms
const ejsMate = require("ejs-mate") // Layout support for EJS templates

const MONGO_URL ="mongodb://127.0.0.1:27017/AIRBNB"; // MongoDB connection string
const wrapAsync = require("./utils/WrapAsync.js")
const ExpressError= require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js")

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

// Root route
app.get("/",(req,res) =>{
    res.send("hii i am root");
});

const validateListing = (req,res,next) =>  {
     let result = listingSchema.validate(req.body)
   if(error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg)
   }else{
    next()
   }

}

//index root
app.get("/listings",wrapAsync( async (req,res) =>{
   const allListings =  await Listing.find({}) // Fetch all listings from DB
    res.render("listings/index",{allListings}) // Render index.ejs with listings
}));


//  NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new"); // Show form to create new listing
});

//show route
app.get("/listings/:id",wrapAsync( async (req,res) => {
    let{id} = req.params // Extract id from params
   const listing = await Listing.findById(id) // Find listing by ID
   res.render("listings/show", {listing}) // Show details page
}))



// CREATE ROUTE
app.post("/listings", 
    validateListing,
    wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing);
  
  await newListing.save();
  res.redirect("/listings");
}));




// DELETE Route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing
    console.log(deletedListing); 
    res.redirect("/listings"); // Redirect to index
}));



//EDIT ROUTE.- 
app.get("/listings/:id/edit",wrapAsync(async(req,res) =>{
    let { id } = req.params
    const listing = await Listing.findById(id) // Fetch listing to edit
   res.render("listings/edit", { listing }); // Render edit form
}))

// Update route - 
app.put("/listings/:id",
    validateListing,
    wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing
    res.redirect("/listings");  // Redirect after update
}));


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

