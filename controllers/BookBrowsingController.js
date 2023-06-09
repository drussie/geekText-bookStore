const express = require("express");
const router = express.Router();
const Books = require("../models/booksModel");

// Users will have a simple and enjoyable way to discover new books and Authors and sort results.
class BookBrowsingController {
  // 1.1 Retrieve List of Books by Genre
  static getByGenre = async (req, res) => {
    const genre = req.params.genre;

    try {
      const books = await Books.find({ genre });
      res.status(200).json(books);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // 1.2 Retrieve List of Top Sellers (Top 10 books that have sold the most copied)
  static getTopTen = async (req, res) => {
    try {
      const books = await Books.find().sort({ copiesSold: -1 }).limit(10);
      res.status(200).json(books);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // 1.3 Retrieve List of Books for a particular rating and higher
  static getByRating = async (req, res) => {
    const rating_param = parseFloat(req.params.rating);

    try {
      const books = await Books.find({ rating: { $gte: rating_param } });
      res.status(200).json(books);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  // 1.4 Discount books by publisher.
  static applyDiscount = async (req, res) => {
    const percentDiscount = 1.0 - parseFloat(req.body.percentDiscount) / 100.0;
    const publisher_param = req.body.publisher;

    try {
      const books = await Books.updateMany(
        { publisher: publisher_param },
        { $mul: { price: percentDiscount } }
      );
      res.status(200).send('Discounts applied!');
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };
}

// routes
router.get("/books/genre/:genre", BookBrowsingController.getByGenre);
router.get("/books/top10", BookBrowsingController.getTopTen);
router.get("/books/rating/:rating", BookBrowsingController.getByRating);
router.put("/books/discount", BookBrowsingController.applyDiscount);

module.exports = router;
