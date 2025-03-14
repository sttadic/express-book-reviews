const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if the user exists
const doesExist = (username) => {
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (userWithSameName.length > 0) {
    return true;
  }
  return false;
};

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(201).json({ message: "User registered" });
    }
    return res.status(400).json({ message: "User already exists" });
  }
  return res.status(400).json({ message: "Invalid request" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  let bookByAuthor = [];
  for (let i in books) {
    if (books[i].author === author) {
      bookByAuthor.push(books[i]);
    }
  }
  if (bookByAuthor.length > 0) {
    return res.status(200).json(bookByAuthor);
  }
  return res.status(404).json({ message: "No books found!" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  let bookByTitle = [];
  for (let i in books) {
    if (books[i].title === title) {
      bookByTitle.push(books[i]);
    }
  }
  if (bookByTitle.length > 0) {
    return res.status(200).json(bookByTitle);
  }
  return res.status(404).json({ message: "No books found!" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
