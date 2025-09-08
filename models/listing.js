const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1663841365331-f8eb24e88e26?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZpbGxhJTIwYmFsYmlhbmVsbG98ZW58MHx8MHx8fDA=";


const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
image: {
  filename: String,
  url: String

  //  default:"https://images.unsplash.com/photo-1663841365331-f8eb24e88e26?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZpbGxhJTIwYmFsYmlhbmVsbG98ZW58MHx8MHx8fDA=",
  //  set: (v) =>
  //    v === ""
 //       ? "https://images.unsplash.com/photo-1663841365331-f8eb24e88e26?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZpbGxhJTIwYmFsYmlhbmVsbG98ZW58MHx8MHx8fDA="
  //      : v
   },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref:"Review",

  },
],
});
listingSchema.post("findOneAndDelete", async (listing)  => {
  if (listing) {
    await Review.deleteMany({
      _id : { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 


