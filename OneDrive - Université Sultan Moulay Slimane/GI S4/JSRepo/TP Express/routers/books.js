const express = require("express");
const router = express.Router();

// In-memory book list
let books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin" },
  { id: 2, title: "The Pragmatic Programmer", author: "Andy Hunt" },
];

// Authentication middleware specific to this router
router.use((req, res, next) => {
  if (req.session && req.session.user) {
    next(); // User is authenticated, proceed
  } else {
    res.status(401).json({
      message: "Unauthorized. Please login at POST /auth/login with admin/admin.",
    });
  }
});

// GET /books - List all books
router.get("/", (req, res) => {
  res.status(200).json(books);
});

// POST /books - Create a new book
router.post("/", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required." });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

module.exports = router;