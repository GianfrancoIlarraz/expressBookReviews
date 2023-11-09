const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let promise = new Promise((resp, rej) => {
        let data = JSON.stringify(books, null, 4)
        resp(data)
        rej('Error occurred')
    })


    promise.then((resp) => {
        res.send(resp);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let promise = new Promise((resp, rej) => {
        const isbn = req.params.isbn;
        resp(isbn)
        rej('Error occurred')
    })


    promise.then((isbn) => {
        res.send(books[isbn])
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let promise = new Promise((resp, rej) => {
        const author = req.params.author;
        const booksArr = Object.values(books)
        let filteredBooks = []
        for (let i = 0; i < booksArr.length; i++) {
            if (booksArr[i].author === author) {
                filteredBooks.push(booksArr[i])
            }
        }

        resp(filteredBooks)
        rej('Error occurred')
    })




});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let promise = new Promise((resp, rej) => {
        const title = req.params.title;
        const booksArr = Object.values(books)
        let filteredBooks = []
        for (let i = 0; i < booksArr.length; i++) {
            if (booksArr[i].title === title) {
                filteredBooks.push(booksArr[i])
            }
        }

        resp(filteredBooks)
        rej('Error occurred')
    })

    promise.then((books) => {
        res.send(books)
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
