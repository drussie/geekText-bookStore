const express = require("express");
const dotenv = require("dotenv").config(); // TODO: ADD .env for PRODUCTION
const mongoose = require("mongoose");
const Books = require("./models/booksModel");
const Wishlist = require("./models/wishlistModel");
const cors = require("cors");

// TODO: move into .env for PRODUCTION
const PORT = 3000;
const MONGO_URI =
  "mongodb+srv://admin1:1234@cluster0.qngmqvw.mongodb.net/GeekTextDB?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// START THE APP
const app = express();

// MIDDLE-WARE
app.use(express.urlencoded()); // ensure we can parse the URL parameters correctly
app.use(cors());

// CONNECT TO DATABASE
mongoose.connect(MONGO_URI, { useNewUrlParser: true }, () =>
  console.log(`MongoDB connected...`)
);

// ROUTES

// ------------------------------ Feature 6 ---------------------------------------
// 6.1 Must be able to create a wishlist of books that belongs to user and 
//     has a unique name 
app.post ("/wishlist/create", async (request, response) => {
  const { name, userId, items } = req.body; 
  const wish = new Wishlist ({
    name, 
    userId, 
    items
  })

  try {
    wish = await wish.save();
    response.status(200).json(wish);
  } catch (error) {
    response.status(400).json({message : error});
  }
});

// 6.2 Must be able to add a book to a user’s wishlisht 

// 6.3 Must be able to remove a book from a user’s wishlist into the 
//     user’s shopping cart 

// 6.4 Must be able to list the book’s in a user’s wishlist 

// ----------------------------------------------------------------------------------

// ------------------------------ Feature 1 ---------------------------------------
// 1.1 Retrieve List of Books by Genre
app.get("/books/genre/:genre", async (request, response) => {
  const genre = request.params.genre; // retrieve the genre from the URL

  try {
    const books = await Books.find({ genre }); // wait for books to be retrieved ASYNCHRONOUSLY
    response.status(200).json(books);
  } catch (error) {
    response.status(404).json({ message: error });
  }
});

// 1.2 Retrieve List of Top Sellers (Top 10 books that have sold the most copied)
app.get("/books/top10", async (req, res) => {
  try {
    const books = await Books.find().sort({ copiesSold: -1 }).limit(10);
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// 1.3 Retrieve List of Books for a particular rating and higher
app.get("/books/rating/:rating", async (req, res) => {
  const rating_param = parseFloat(req.params.rating);

  try {
    const books = await Books.find({ rating: { $gte: rating_param } });
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// 1.4 Discount books by publisher
app.put("/books/discount", async (req, res) => {
  const percentDiscount = 1.0 - parseFloat(req.body.percentDiscount) / 100.0;
  const publisher_param = req.body.publisher;

  try {
    const books = await Books.updateMany(
      { publisher: publisher_param },
      { $mul: { price: percentDiscount } }
    );
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// ----------------------------------------------------------------------------------

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
