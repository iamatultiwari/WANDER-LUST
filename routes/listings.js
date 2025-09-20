const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../Cloudconfig.js")
const upload = multer({storage})


router
  .route("/") // INDEX route - list all listings
  .get(wrapAsync(listingController.index)) // CREATE route - add new listing
  .post(
    isLoggedIn,
   // validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListings)
  );


// NEW route - show form to create new listing
router.get("/new",isLoggedIn,listingController.rendernewForm );

router
  .route("/:id")
  // SHOW route - show details for a listing
  .get(wrapAsync(listingController.showListing))
  // UPDATE route - update existing listing
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.upadateListing)
  )
  // DELETE route - delete a listing
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// EDIT route - show form to edit a listing
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router;
