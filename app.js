const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Listing = require('./models/listing');

const methodOverride = require('method-override'); // Import method-override
const ejsMate = require('ejs-mate'); // Assuming you're using ejs-mate for enhanced EJS features

const MONGO_URL = "mongodb://127.0.0.1:27017/pink1";

// Set view engine and views directory
app.engine("ejs", ejsMate); // Assuming you have ejs-mate set up for enhanced EJS rendering
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // "_method" is the default for method-override

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


  app.get("/", (req, res) => {
    console.log("Redirecting to /listings");
    res.redirect("/listings");
  });
  
// Index Route with Search Functionality
app.get("/listings", async (req, res) => {
    try {
      let filter = {};
  
      // Retrieve search query parameter
      const { query } = req.query;
  
      // Construct filter based on provided query parameter
      if (query) {
        filter = {
          $or: [
            { aesthetic: new RegExp(query, 'i') },
            { color: new RegExp(query, 'i') },
            { title: new RegExp(query, 'i') }
          ]
        };
      }
  
      const allListings = await Listing.find(filter);
      res.render("listings/index", { allListings, query });
    } catch (err) {
      console.error("Error fetching listings:", err);
      res.status(500).send("Server Error");
    }
  });
  
  // Show Route

// Show Route
app.get("/listings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).send("Listing not found");
      }
      res.render("listings/show", { listing });
    } catch (err) {
      console.error("Error fetching listing details:", err);
      res.status(500).send("Server Error");
    }
  });



// Route to render the discover page
app.get('/discover', (req, res) => {
    res.render('discover'); // Renders discover.ejs
  });
  
  // Route to render the quiz page
  app.get('/quiz', (req, res) => {
    res.render('quiz'); // Renders quiz.ejs
  });
  
  // Route to handle quiz submission
  app.post('/submit-quiz', (req, res) => {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
    res.render('result', { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 }); // Renders result.ejs with quiz data
  });
  

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
