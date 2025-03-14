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
    let token = jwt.sign({ username }, "fingerprint_customer");
    req.session.authorization = { token, username };
    return res.status(200).json({ message: "User logged in" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
/* module.exports.isValid = isValid; */
module.exports.users = users;
