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
public_users.get("/", async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => {
      resolve(JSON.stringify(books, null, 4)); // Simulating async operation
    });
    res.status(200).send(bookList);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  try {
    const book = await new Promise((resolve) => {
      resolve(books[isbn]); // Simulating async operation
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;
  try {
    const booksByAuthor = await new Promise((resolve) => {
      let bookList = [];
      for (let key in books) {
        if (books[key].author === author) {
          bookList.push(books[key]);
        }
      }
      resolve(bookList);
    });
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    }
    res.status(404).json({ message: "No books found!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  try {
    const booksByTitle = await new Promise((resolve) => {
      let bookList = [];
      for (let key in books) {
        if (books[key].title === title) {
          bookList.push(books[key]);
        }
      }
      resolve(bookList);
    });
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    }
    res.status(404).json({ message: "No books found!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
