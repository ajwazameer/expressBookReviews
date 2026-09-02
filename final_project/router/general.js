const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      return res.status(203).json({ message: "Username already exists" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered successfully!" });
    }
  } else {
    return res.status(404).json({ message: "User can't be registered" });
  }
});

// Get the book list available in the shop
public_users.get("/books", function async(req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/books");

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error getting books",
    });
  }
});

// Get book details based on ISBN
public_users.get("/book/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  console.log(isbn);
  const book = books[isbn];
  console.log(book);
  if (book === "" || book == null) {
    return res.status(404).json({ message: "No book found!" });
  } else {
    return res.status(200).json(book);
  }
});

public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(`http://localhost:5000/book/isbn/${isbn}`);

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);

    return res.status(404).json({
      message: "No book found!",
    });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const book = booksArray.filter((book) => {
    return book.author === author;
  });
  if (book[0] === "" || book[0] == null) {
    return res.status(404).json({ message: "No book found!" });
  } else {
    return res.status(200).json(book);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  const book = booksArray.filter((book) => {
    return book.title === title;
  });
  if (book[0] === "" || book[0] == null) {
    return res.status(404).json({ message: "No book found!" });
  } else {
    return res.status(200).json(book);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book === "" || book == null || !book.reviews) {
    return res.status(404).json({ message: "No book review found!" });
  } else {
    return res.status(200).json(book.reviews);
  }
});

module.exports.general = public_users;
