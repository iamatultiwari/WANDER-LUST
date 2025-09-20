const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js")
const ExpressError= require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
 // Import the listing model
const {listingSchema,reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


//post REVIEW ROUTE
router.post("/",
  isLoggedIn,
  validateReview,
   wrapAsync(reviewController.createReview));

// DELETE  review Route
router.delete("/:reviewId", 
  isLoggedIn,
  isreviewAuthor,
  wrapAsync(reviewController.destroyReview));

module.exports = router;