const express = require('express');
const mysql = require('mysql2/promise'); // Import the promise-based version
const UserRegisterController = require('../Controller/User/UserRegisterController');
const BookController = require('../Controller/User/book');
const cors = require('cors');
const ReserveController = require('../Controller/User/Reserve');
const UserLoginController = require('../Controller/User/UserLoginController');
const BookUpdate = require('../Controller/User/updatebook');
const BookDelete = require('../Controller/User/deletebook');


const app = express();
const port = 5002;

// Enable CORS
app.use(cors());
app.use(express.json());

// MySQL connection configuration with promise support
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fyp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Use the correct function name UserRegisterController
UserRegisterController(app, db);
BookController(app, db);
ReserveController(app, db);
BookUpdate(app, db);
BookDelete(app, db);
app.use('/',UserLoginController (db)); 

// Check Database Connection
// Connect to the database

app.post('/search', async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
      return res.status(400).json({
          error: 'Search term is required'
      });
  }

  const query = `
      SELECT * FROM books
      WHERE bookName LIKE ? 
      OR author LIKE ?
      OR shelf LIKE ?
  `;

  const searchValue = `%${searchTerm}%`;

  try {
      const [results] = await db.query(query, [searchValue, searchValue, searchValue]);

      if (results.length === 0) {
          return res.status(404).json({
              error: 'Books not found'
          });
      }
      res.json(results);
  } catch (error) {
      console.error('Error executing search query:', error);
      return res.status(500).json({
          error: 'Internal server error'
      });
  }
});


app.get("/books", async (req, res) => {
  try {
    // Fetching all books from the database
    const [books] = await db.query("SELECT * FROM books");

    // Sending the list of books as a response
    res.status(200).json({ books });
  } catch (error) {
    // Handling any errors that occur during the retrieval process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // Check if the book exists
    const [existingBooks] = await db.query("SELECT * FROM books WHERE id = ?", [bookId]);
    
    if (existingBooks.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the book from the database
    await db.query("DELETE FROM books WHERE id = ?", [bookId]);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
