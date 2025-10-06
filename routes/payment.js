const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Listing = require("../models/listing");

router.post("/create-checkout-session/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: listing.description,
              images: [listing.image.url],
            },
            unit_amount: listing.price * 100, // convert ₹ to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating checkout session");
  }
});

module.exports = router;
