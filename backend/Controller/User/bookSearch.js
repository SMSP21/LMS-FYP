const express = require('express');
const mysql = require('mysql2/promise'); // Import the promise-based version
const cors = require('cors');

const bookSearch = async (app, db, port) => {
  // Middleware
  app.use(express.json());
  app.use(cors());

  // Search endpoint
  app.post('/search', async (req, res) => {
    try {
      const { searchTerm, searchOption } = req.body;

      if (!searchTerm) {
        return res.status(400).json({
          error: 'Search term is required'
        });
      }
      
      let query;
      
      if (searchOption === 'name') {
        query = `SELECT * FROM books WHERE bookName LIKE ?`;
      } else if (searchOption === 'author') {
        query = `SELECT * FROM books WHERE author LIKE ?`;
      } else if (searchOption === 'shelf') {
        query = `SELECT * FROM books WHERE shelf LIKE ?`;
      } else {
        return res.status(400).json({
          error: 'Invalid search option'
        });
      }
      
      const searchValue = `%${searchTerm}%`;
      
      const [results] = await db.query(query, [searchValue]);

      if (results.length === 0) {
        return res.status(404).json({
          error: 'No books found'
        });
      }
      
      res.json(results); 
    } catch (error) {
      console.error('Error executing search query:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  });

  // Get all books
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

  
  // Update a book
  app.put("/books/:id", async (req, res) => {
    const bookId = req.params.id;
    const { bookName, author, shelf, alternateTitle, CostPerBook, publisher, bookCountAvailable, bookStatus } = req.body;
    console.log(bookName, author, shelf, alternateTitle, CostPerBook, publisher, bookCountAvailable, bookStatus);
    try {
      // Update the book in the database
      await db.query("UPDATE books SET bookName = ?, author = ?, shelf = ?, alternateTitle = ?, CostPerBook = ?, publisher = ?, bookCountAvailable = ?, bookStatus = ? WHERE id = ?", [bookName, author, shelf, alternateTitle, CostPerBook, publisher, bookCountAvailable, bookStatus, bookId]);
      res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  // Delete a book
  app.delete("/books/:id", async (req, res) => {
    const bookId = req.params.id;
  
    try {
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
};

module.exports = bookSearch;
