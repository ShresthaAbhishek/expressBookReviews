const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the ones we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "Invalid credentials. Please try again." });
  }

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username }, "your_secret_key_here");
  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Get the authenticated user from the JWT token (you'll need to implement this middleware in index.js)
  const { username } = req.user;
  // Check if the user has already added a review for this book
  if (books[isbn].reviews[username]) {
    return res
      .status(400)
      .json({ message: "You have already added a review for this book." });
  }

  // Add the review for the book
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
