const express =  require ("express"); // Import express
const app = express();
const mongoose = require("mongoose"); // Import mongoose for MongoDB
const Listing = require("./models/listing.js"); // Import the listing model
const path = require("path") // Core Node.js module to handle file paths
//const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";
const methodOverride = require("method-override") // To support PUT & DELETE in forms
const ejsMate = require("ejs-mate") // Layout support for EJS templates

const MONGO_URL ="mongodb://127.0.0.1:27017/AIRBNB"; // MongoDB connection string

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

// Root route
app.get("/",(req,res) =>{
    res.send("hii i am root");
});


//index root
app.get("/listings", async (req,res) =>{
   const allListings =  await Listing.find({}) // Fetch all listings from DB
    res.render("listings/index.ejs",{allListings}) // Render index.ejs with listings
});


//  NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs"); // Show form to create new listing
});


//show route
app.get("/listings/:id", async (req,res) => {
    let{id} = req.params // Extract id from params
   const listing = await Listing.findById(id) // Find listing by ID
   res.render("listings/show.ejs", {listing}) // Show details page
})

//CREATE ROUTE- 
// app.post("/listing", async (req, res) => {
//  //  let {title,description, image , price, country , location } = req.body - in place of this we can write the listing in ejs file and pass the value as objext 
//  let listing= req.body
// console.log(listing);
//  res.send("Listing received")

// })

// CREATE ROUTE
app.post("/listing", async (req, res) => {
  const newListing = new Listing(req.body.listing); // Create a new listing object
  await newListing.save(); // Save it to DB
  res.redirect("/listings"); // Redirect to listings page
});


// DELETE Route
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing
    console.log(deletedListing); 
    res.redirect("/listings"); // Redirect to index
});


// app.get("/testlisting", async  (req,res) =>  {
//     let sampleListing = new Listing({
//         title : "my new villa",
//         description: "buy it",
//         price:2000,
//         location:"goa",
//         country:"india"
//     })

//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send("succesfully testing")
    
// } )


//EDIT ROUTE.- 
app.get("/listings/:id/edit",async(req,res) =>{
    let { id } = req.params
    const listing = await Listing.findById(id) // Fetch listing to edit
   res.render("listings/edit.ejs", { listing }); // Render edit form
})

//Upadate route - 
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing
    res.redirect("/listings");  // Redirect after update
});



// Start server on port 8000
app.listen(8000, () =>{
    console.log("server is listening on port 8000");
});

