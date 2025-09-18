const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")

// Middleware to validate listing


// INDEX route - list all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// NEW route - show form to create new listing
router.get("/new",isLoggedIn, (req, res) => {
    // console.log(req.user);
    // if(!req.isAuthenticated()) {
    //     req.flash("error", "you must be logged in to create listing!")
    //      return res.redirect("/login")
    // }
    res.render("listings/new");
});

// EDIT route - show form to edit a listing
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));

// CREATE route - add new listing
router.post("/", 
    isLoggedIn,
    validateListing, 
    wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
  //  console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created.!");
    res.redirect("/listings");
}));

// UPDATE route - update existing listing
router.put("/:id",
     isLoggedIn,
     isOwner,
     validateListing,
      wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);

    // if (!listing.owner._id.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }

    // // continue with update logic here...

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated.!");
   // res.redirect("/listings");
   res.redirect(`/listings/${id}`);
}));

// DELETE route - delete a listing
router.delete("/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted.!");
    res.redirect("/listings");
}));

// // SHOW route - show details for a listing

// **IMPORTANT:** Place this last so it doesn't capture /new or /edit
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID!");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id)
  .populate({
  path: "reviews",
  populate: {
    path: "author",   
  },
})

    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
}));






module.exports = router;
