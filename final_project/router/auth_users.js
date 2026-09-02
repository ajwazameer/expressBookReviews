const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => {
    return user.username === username;
  });
};

const authenticatedUser = (username, password) => {
  return users.some((user) => {
    return user.username === username && user.password === password;
  });
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
        req.session.authorization = {
          token,
          username,
        };
        return res
          .status(200)
          .json({ message: "User logged in successfully!" });
      } else {
        return res
          .status(203)
          .json({ message: "Incorrect Username/password." });
      }
    } else {
      return res.status(404).json({ message: "User doesn't exists" });
    }
  } else {
    return res.status(404).json({ message: "User can't be logged in" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added successfully!",
      review: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "Book doesn't exists." });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    console.log(books[isbn].reviews);
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully!",
      review: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "Book doesn't exists." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
