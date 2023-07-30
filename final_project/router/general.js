const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res
      .status(409)
      .json({
        message: "Username already exists. Please choose a different username.",
      });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Registration successful." });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  return res.status(200).json(Object.values(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params;
  if (!author) {
    return res.status(400).json({ message: "Author name is required." });
  }

  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length === 0) {
    return res
      .status(404)
      .json({ message: "Books by the given author not found." });
  }

  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const { title } = req.params;
  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const booksByTitle = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
  if (booksByTitle.length === 0) {
    return res
      .status(404)
      .json({ message: "Books with the given title not found." });
  }

  return res.status(200).json(booksByTitle);
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
