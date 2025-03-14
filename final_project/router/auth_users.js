const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/* const isValid = (username) => {
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (userWithSameName.length > 0) {
    return true;
  }
  return false;
}; */

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid request" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, "fingerprint_customer");
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User logged in" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // console.log(req.session.authorization.username);
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: `User ${username} added following review for book ${books[isbn].title}: ${review}`,
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: `User ${username} deleted review for book ${books[isbn].title}`,
      });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
/* module.exports.isValid = isValid; */
module.exports.users = users;
