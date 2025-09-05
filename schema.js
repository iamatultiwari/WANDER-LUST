const joi = require('joi')

module.exports.listingSchema = joi.object({
    listing : joi.object({
        listing :joi.object({
            title:joi.string().required(),
            description :joi.string().required(),
            price:joi.number().required().min(0),
            location :joi.string().required(),
            country :joi.string().required(),
            image :joi.string().allow("",null),
        })
    }).required()
});


const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required()
  }).required()
});
