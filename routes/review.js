const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js")
const ExpressError= require("../utils/ExpressError.js")
const Listing = require("../models/listing.js"); // Import the listing model
const {listingSchema,reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");


//validateReview - mmiddleware.
const validateReview = (req,res,next) =>  {
     let {error} = reviewSchema.validate(req.body)
   if(error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg)
   }else{
    next()
   }
}
//post REVIEW ROUTE
router.post("/",validateReview, wrapAsync(async(req, res) => {
    console.log(req.params.id);
   let listing = await Listing.findById(req.params.id);
   if (!listing) throw new ExpressError(404, "Listing not found");//ct
 // Create review document
   let newReview = new Review(req.body.review);
// Add reference of review to listing
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();

    req.flash("success"," Review Created.!")

  //  console.log("new review saved");
  //  res.send("new review saved");
  res.redirect(`/listings/${listing._id}`)
}));

// DELETE  review Route
router.delete("/:reviewId", 
  wrapAsync(async (req, res) => {
    //let { id, reviewId } = req.params;
    const { reviewId } = req.params;// by-ct

    // Pull review reference from the listing
   // await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
       await Listing.findByIdAndUpdate(req.params.id, { $pull: { reviews: reviewId } });//by -ct

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

     req.flash("success"," Review Deleted.!")

    // Redirect back to the listing detail page
    //res.redirect(`/listings/${id}`);
        res.redirect(`/listings/${req.params.id}`);//by -ct
}));

module.exports = router;