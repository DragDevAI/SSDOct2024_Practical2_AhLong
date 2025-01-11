const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PG_PORT || 3000;

// Create a pool of connections with node-postgres
require('dotenv').config();
const dbConfig = require('./DBConfig');

const Pool = require('pg').Pool;
const pool = new Pool(dbConfig);
const bookController = require('./controllers/booksController');
const validateBook = require('./middlewares/validateBook');

// Include body-parser middleware to handle JSON data (for CREATE/POST and UPDATE/PUT)
app.use(express.json());
// Configure body-parser to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true })); // Set extended: true for nested objects

// Return info at the root level
app.get("/", (ask,ans) => {
    console.log("Console: root is triggered");
    //ans.json({info: "Welcome to Practical 2", name: "Ah Long", location: "browser", instruction: "TYPE /redirect in your browser FOR A SURPRISE"});
    ans.send("<html><h1 style=\"font-family:courier\";;>Welcome to Practical 2</h1><h3><i>This is Ah Long</i></h3><script>console.log(\'this is in line\'); const message = \"<%=message %>\"; alert(message);</script><p>Type /redirect in your browser for a surprise</p></html>");
});
// Redirect
app.get("/redirect", (req,res) => {
    res.redirect('https://sg.linkedin.com/in/henryneo');
});

// CRUD Routes with route chaining
app.route("/books")
    .get(bookController.getAllBooks)
    .post(validateBook, bookController.createBook);

app.route("/books/:id")
    .get(bookController.getBookByID)
    .put(validateBook, bookController.updateBook)
    .delete(bookController.deleteBook);

// Handling error
app.get("/", (err,req,res,next) => {
    console.error(err,stack);
    res.status(500).send("Error! Error! Error!");
});

// Start server
app.listen(port,async() => {
    try {
        await pool.connect();
        console.log("Database connect successful");
    }
    catch(err) {
        console.error("Databse connection error",err);
        process.exit(1);
    }
    console.log(`Server listening on port: ${port}`);
});

// Close connection
process.on("SIGTERM", async() => {
    console.log("Server is shutting down in a smart move");
    await pool.end();
    console.log("Data connection closed");
    process.exit(0);
});