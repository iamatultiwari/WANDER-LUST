// Import Mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Import initial data to seed the database
const initdata = require("../init/data.js");

// Import the Listing model (FIX: missing "/" in path)
const Listing = require("../models/listing.js"); 

// Define MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";

// Connect to MongoDB using async/await
main()
  .then(() => {
    console.log("connected to db"); // Success message
  })
  .catch(err => {
    console.log(err); // Log connection error
  });

async function main() {
  await mongoose.connect(MONGO_URL); // Await MongoDB connection
}

// Seed function to initialize database with default data
const initDB = async () => {
  await Listing.deleteMany({});         // Delete all existing listings
 initdata.data = initdata.data.map(obj => ({
  ...obj,
  owner: "68c9baa11c6604562e94e3af"
}));

  await Listing.insertMany(initdata.data); // Insert new seed listings
  console.log("data was initialized");  // Log success
};

initDB(); // Run the seed function

