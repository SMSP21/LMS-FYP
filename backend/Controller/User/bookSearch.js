const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5002;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL connection pool
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'your_username', // Replace 'your_username' with your MySQL username
    password: 'your_password', // Replace 'your_password' with your MySQL password
    database: 'fyp',
});

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err; // Terminate the application if unable to connect to the database
    } else {
        console.log('Connected to MySQL');
        connection.release(); // Release the connection after testing
    }
});

// Search endpoint
app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm;
  
    if (!searchTerm) {
      return res.status(400).json({
        error: 'Search term is required'
      });
    }
  
    const query = `
      SELECT * FROM items
      WHERE bookName LIKE ? 
      OR shelf LIKE ? 
      OR author LIKE ?
    `;
  
    const searchValue = `%${searchTerm}%`;
  
    db.query(query, [searchValue, searchValue, searchValue], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({
          error: 'Internal server error'
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          error: 'Book not found'
        });
      }
      res.json(results);
    });
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
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
