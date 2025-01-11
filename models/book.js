const Pool = require('pg').Pool;
//const { response } = require('express');
const dbConfig = require("../DBConfig");
const pool = new Pool(dbConfig);

class Book {
    constructor (id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
    }

    // CRUD methods
    // R(ead) - GET all books
    static async getAllBooks() {
        const client = await pool.connect();
        const postgreSQL = `SELECT * FROM books`;
        try {
            const result = await client.query(postgreSQL); // read from database
            return result.rows.map(
                (row) => new Book(row.id, row.title, row.author)
            ); // convert row by row to Book object
        } catch(err) {
            console.error("Error reading books",err);
            throw err;
        } finally {
            client.release(); // Release client back to the pool
        }
    }

    // R(ead) - GET a book by ID
    static async getBookByID(id) {
        const client = await pool.connect();
        const postgreSQL = `SELECT * FROM books WHERE id = $1`;
        try {
            const result = await client.query(postgreSQL,[id]);
            if (result.rows.length >0) {
                const book = result.rows[0];
                return new Book(book.id, book.title, book.author);
            } else {
                return null;
            }
        } catch(err) {
            console.error(`Error getting books`,err);
            throw err;
        } finally {
            client.release(); // Release client back to the pool
        }
    }
    
    // C(reate) - POST a new book
    static async createBook(newBookData) {
        const client = await pool.connect();
        const postgreSQL = `INSERT INTO books(title, author) VALUES($1, $2) RETURNING id`;
        const bodyValues = [
            newBookData.title,
            newBookData.author
        ];
        try {
            const result = await client.query(postgreSQL,bodyValues);
            const newBookID = result.rows[0].id; // Get id of the newly added book
            return this.getBookByID(newBookID);  // Display newly created book with its ID
        } catch(err) {
            console.error(`Error creating books`,err);
            throw err;
        } finally {
            client.release(); // Release client back to the pool
        }
    }
    
    // U(pdate) - UPDATE an existing book
    static async updateBook(id,newBookData) {
        const client = await pool.connect();
        const postgreSQL = `UPDATE books SET title=$1, author=$2 WHERE id=$3`;
        const bodyValues = [
            newBookData.title || null,
            newBookData.author || null,
            id
        ];
        try {
            await client.query(postgreSQL,bodyValues);
            return this.getBookByID(id);  // Returning the updated book with its ID
        } catch(err) {
            console.error(`Error creating books`,err);
            throw err;
        } finally {
            client.release(); // Release client back to the pool
        }
    }
    // D(elete) - DELETE an existing book
    static async deleteBook(id) {
        const client = await pool.connect();
        const postgreSQL = `DELETE FROM books WHERE id=$1`;
        try {
            const result = await client.query(postgreSQL,[id]);
            if (result.rowCount > 0) {
                console.log(`Book ID ${[id]} deleted successfully`);
                return true;
            };
        } catch(err) {
            console.error(`Error deleting book`,err);
            throw err;
        } finally {
            client.release(); // Release client back to the pool
        }
    }
}

module.exports = Book;