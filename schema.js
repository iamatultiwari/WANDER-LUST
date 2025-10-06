const Joi = require("joi");

// ✅ Listing Schema
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    // Image as nested object to match Mongoose model
    image: Joi.object({
      url: Joi.string().uri().allow("", null),        // optional URL
      filename: Joi.string().allow("", null)          // optional filename
    }).optional(),
    // Category field (required)
    category: Joi.string()
      .valid(
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
      )
      .required()
  }).required()
});

// ✅ Review Schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});
