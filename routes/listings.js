const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // Import the listing model
const { reviewSchema } = require("../schema.js")
const wrapAsync = require("../utils/WrapAsync.js")
const ExpressError= require("../utils/ExpressError.js")

const Review = require("../models/review.js");



const validateListing = (req,res,next) =>  {
   //  let result = listingSchema.validate(req.body)
       let { error } = listingSchema.validate(req.body);
   if(error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg)
   }else{
    next()
   }

}




//index route
router.get("/",wrapAsync( async (req,res) =>{
   const allListings =  await Listing.find({}) // Fetch all listings from DB
    res.render("listings/index",{allListings}) // Render index.ejs with listings
}));


//  NEW route
router.get("/new", (req, res) => {
    res.render("listings/new"); // Show form to create new listing
});

//show route
router.get("/:id",wrapAsync( async (req,res) => {
    let{id} = req.params // Extract id from params
   const listing = await Listing.findById(id).populate("reviews") // Find listing by ID
   res.render("listings/show", {listing}) // Show details page
}))

// CREATE ROUTE
router.post("/", 
    validateListing,
    wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing);
  
  await newListing.save();
  res.redirect("/listings");
}));








//EDIT ROUTE.- 
router.get("/:id/edit",wrapAsync(async(req,res) =>{
    let { id } = req.params
    const listing = await Listing.findById(id) // Fetch listing to edit
   res.render("listings/edit", { listing }); // Render edit form
}))

// Update route - 
router.put("/:id",
    validateListing,
    wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing
    res.redirect("/listings");  // Redirect after update
}));



module.exports = router;