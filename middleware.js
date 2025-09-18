const Listing = require('./models/listing');
const Review = require('./models/review.js');
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
   // console.log(req.path, "..", req.originalUrl);
        if(!req.isAuthenticated()) {
          req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!")
         return res.redirect("/login")
    }
    next();
  }

  module.exports.saveRedirectUrl = (req,res,next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  }
  // because passport after login session info delete 
  // kr deta hai isliye ham ise locals me save kara lenge nd 
  // export kr lenge



  module.exports.isOwner = async(req,res,next) => {
        let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }

 module.exports.validateListing = (req, res, next) => {
      const { error } = listingSchema.validate(req.body);
      if (error) {
          const errMsg = error.details.map(el => el.message).join(",");
          throw new ExpressError(400, errMsg);
      } else {
          next();
      }
  };

  //validateReview - mmiddleware.
  module.exports.validateReview = (req,res,next) =>  {
       let {error} = reviewSchema.validate(req.body)
     if(error) {
      let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400, errMsg)
     }else{
      next()
     }
  }
module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  //  Use the Model (Review), not the variable `review`
  let review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  //  Use the document's author, not the Model
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

//   module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const reviewDoc = await Review.findById(reviewId);
//  // fetched document

//     if (!reviewDoc.author._id.equals(res.locals.currUser._id)) {
//         req.flash("error", "You are not the author of this review!");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };
