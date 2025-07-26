const express =  require ("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")
//const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";
const methodOverride = require("method-override")






const MONGO_URL ="mongodb://127.0.0.1:27017/AIRBNB";

main().then(() =>{
    console.log("connected to db");
 }).catch(err=> {
    console.log(err);
 });
async function main() {
  await mongoose.connect(MONGO_URL);
    
}

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))



app.get("/",(req,res) =>{
    res.send("hii i am root");
});


// app.get("/", (req,res) =>{
//     res.send("hiii am root")
// });
//index root
app.get("/listings", async (req,res) =>{
   const allListings =  await Listing.find({})
    res.render("listings/index.ejs",{allListings})
});


//  NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs"); 
});



//show route
app.get("/listings/:id", async (req,res) => {
    let{id} = req.params
   const listing = await Listing.findById(id)
   res.render("listings/show.ejs", {listing})
})

//CREATE ROUTE- 
// app.post("/listing", async (req, res) => {
//  //  let {title,description, image , price, country , location } = req.body - in place of this we can write the listing in ejs file and pass the value as objext 
//  let listing= req.body
// console.log(listing);
//  res.send("Listing received")

// })

// CREATE ROUTE
app.post("/listing", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});


// DELETE Route
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); 
    res.redirect("/listings");
});






// app.get("/testlisting", async  (req,res) =>  {
//     let sampleListing = new Listing({
//         title : "my new villa",
//         description: "buy it",
//         price:2000,
//         location:"goa",
//         country:"india"
//     })

//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send("succesfully testing")
    
// } )


//EDIT ROUTE.- 

app.get("/listings/:id/edit",async(req,res) =>{
    let { id } = req.params
    const listing = await Listing.findById(id)
   res.render("listings/edit.ejs", { listing });


})

//Upadate route - 
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings"); 
});

app.listen(8000, () =>{
    console.log("server is listening on port 8000");
});

