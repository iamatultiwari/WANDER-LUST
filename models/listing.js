const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

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
    url: { type: String, default: DEFAULT_IMAGE_URL }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "rooms",
      "trending",
      "cities",
      "mountain",
      "castles",
      "pools",
      "camping",
      "arctic",
      "farms",
      "domes",
      "boats"
    ],
    required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
