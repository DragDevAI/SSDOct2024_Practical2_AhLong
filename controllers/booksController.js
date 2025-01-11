const Book = require('../models/book');

const getAllBooks = async(req,res) => {
    try {
        const books = await Book.getAllBooks();
        res.json(books);                    // Return all books as json
    } catch(err) {
        console.error("Error retrieving books",err);
        res.status(500).send("Error retrieving books");
    }
};

const getBookByID = async(req,res) => {
    const bookID = parseInt(req.params.id); // Retrieve book id from URL parameter
    try {
        const book = await Book.getBookByID(bookID);
        if (!book) {
            // If no book is found, send a 404 response
            return res.status(404).send("Book not found!");
        }
        res.json(book);
    } catch(err) {
        console.error("Error retrieving books",err);
        res.status(500).send("Error retrieving books");
    }    
};

const createBook = async(req,res) => {
    const newBook = req.body; // Getting detail of new book from URL
    try {
        const createdBook = await Book.createBook(newBook);
        res.status(201).json(createdBook);
    } catch(err) {
        console.error("Error creating books",err);
        res.status(500).send("Error creating books");
    }    
};

const updateBook = async(req,res) => {
    const bookID = parseInt(req.params.id);
    const bookData = req.body;
    try {
        const updateBook = await Book.updateBook(bookID, bookData);
        if (!updateBook) {
            return res.status(404).send("Book not found");
        };
        res.json(updateBook);
    } catch(err) {
        console.error("Error updating book",err);
        res.status(500).send("Error updating book");
    }    
};

const deleteBook = async(req,res) => {
    const bookID = parseInt(req.params.id);
    try {
        const success = await Book.deleteBook(bookID);
        if (!success) {
            return res.status(404).send("Book not found");
        };
        res.status(204).send();
    } catch(err) {
        console.error("Error deleting book",err);
        res.status(500).send("Error deleting book");
    }    
};

module.exports = {
    getAllBooks,
    getBookByID,
    createBook,
    updateBook,
    deleteBook,
}