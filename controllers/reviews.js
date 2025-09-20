 const Listing = require("../models/listing.js")
  const Review = require("../models/review.js")


module.exports.createReview = async(req, res) => {
    console.log(req.params.id);
   let listing = await Listing.findById(req.params.id);
   if (!listing) throw new ExpressError(404, "Listing not found");//gt
 // Create review document
   let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
// Add reference of review to listing
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();

    req.flash("success"," Review Created.!")

  //  console.log("new review saved");
  //  res.send("new review saved");
  res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async (req, res) => {
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
}