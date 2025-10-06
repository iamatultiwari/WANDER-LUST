const mongoose = require("mongoose");
const Review = require("./review.js");

const { Schema } = mongoose;

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1663841365331-f8eb24e88e26?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZpbGxhJTIwYmFsYmlhbmVsbG98ZW58MHx8MHx8fDA=";

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      filename: { type: String },
      url: {
        type: String,
        default: DEFAULT_IMAGE_URL,
      },
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },

    location: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    // models/listing.js

status: {
  type: String,
  enum: ["available", "sold"],
  default: "available"
},

buyer: {
  type: Schema.Types.ObjectId,
  ref: "User",
  default: null
},


    // ✅ Category for filtering
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
        "boats",
      ],
      required: [true, "Category is required"],
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Cascade delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && Array.isArray(listing.reviews) && listing.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
