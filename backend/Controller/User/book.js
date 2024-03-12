// Defining the BookController function that takes 'app' and 'db' as parameters
const BookController = (app, db) => {
  
  // Endpoint for adding a new book
  app.post("/addbook", async (req, res) => {
    try {
      // Destructuring book details from the request body
      const {
        bookName,
        alternateTitle,
        author,
        language,
        publisher,
        bookCountAvailable,
        bookStatus,
        catalogs
      } = req.body;
  
      // Acquiring a connection from the database pool and starting a transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();
  
      try {
        // Inserting book details into the 'books' table
        const [result] = await connection.query(`
          INSERT INTO books 
            (bookName, alternateTitle, author, language, publisher, bookCountAvailable, bookStatus) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [bookName, alternateTitle, author, language, publisher, bookCountAvailable, bookStatus]);
  
        // Rolling back the transaction if the book insertion fails
        if (result.affectedRows !== 1) {
          await connection.rollback();
          res.status(500).json({ error: "Failed to add book" });
          return;
        }
  
        const bookId = result.insertId;
  
        // Inserting catalog entries (if applicable)
        if (catalogs && catalogs.length > 0) {
          const catalogsInsertPromises = catalogs.map(async (catalogId) => {
            await connection.query(`
              INSERT INTO catalog (bookId, catalogId) 
              VALUES (?, ?)
            `, [bookId, catalogId]);
          });
  
          await Promise.all(catalogsInsertPromises);
        }
  
        // Committing the transaction and releasing the connection
        await connection.commit();
        connection.release();
  
        // Sending success response
        res.status(200).json({ id: bookId, message: "Book added successfully" });
      } catch (error) {
        // Rolling back the transaction and releasing the connection in case of an error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (err) {
      // Handling any errors that occur during the book addition process
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Endpoint for retrieving all books
  app.get("/allbooks", async (req, res) => {
    try {
      // Acquiring a connection from the database pool and querying all books
      const connection = await db.getConnection();
      const [rows] = await connection.query("SELECT * FROM books");
      connection.release();
  
      // Sending the list of books as a JSON response
      res.status(200).json(rows);
    } catch (err) {
      // Handling any errors that occur during the retrieval of all books
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Endpoint for retrieving a specific book by ID
  app.get("/getbook/:id", async (req, res) => {
    try {
      // Acquiring a connection from the database pool and querying the book by ID
      const connection = await db.getConnection();
      const [rows] = await connection.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
      connection.release();
  
      // Checking if the book was found and sending the response accordingly
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    } catch (err) {
      // Handling any errors that occur during the retrieval of a specific book
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Endpoint for updating book details
  app.put("/updatebook/:id", async (req, res) => {
    try {
      // Acquiring a connection from the database pool and extracting book details from the request body
      const connection = await db.getConnection();
      const book = req.body;
  
      // Extracting the properties from the book object
      const { bookName, alternateTitle, author, language, publisher, bookCountAvailable, bookStatus } = book;
  
      // Updating the books table with the extracted properties
      await connection.query(
        "UPDATE books SET bookName = ?, alternateTitle = ?, author = ?, language = ?, publisher = ?, bookCountAvailable = ?, bookStatus = ? WHERE id = ?",
        [bookName, alternateTitle, author, language, publisher, bookCountAvailable, bookStatus, req.params.id]
      );
  
      // Releasing the connection and sending success response
      connection.release();
      res.status(200).json({ message: "Book details updated successfully" });
    } catch (err) {
      // Handling any errors that occur during the book update process
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Endpoint for removing a book by ID
  app.delete("/removebook/:id", async (req, res) => {
    try {
      // Acquiring a connection from the database pool and extracting the book ID from the request
      const connection = await db.getConnection();
      const bookId = req.params.id;
  
      // Checking if the book with the given ID exists
      const [existingBook] = await connection.query("SELECT * FROM books WHERE id = ?", [bookId]);
  
      // Returning a 404 response if the book is not found
      if (existingBook.length === 0) {
        connection.release();
        return res.status(404).json({ error: "Book not found" });
      }
  
      // Deleting the book from the books table
      const [result] = await connection.query("DELETE FROM books WHERE id = ?", [bookId]);
  
      // Checking the result of the deletion operation
      if (result.affectedRows === 1) {
        // Deleting associated entries in the catalog table
        await connection.query("DELETE FROM catalog WHERE bookId = ?", [bookId]);
  
        // Releasing the connection and sending success response
        connection.release();
        res.status(200).json({ message: "Book has been deleted" });
      } else {
        // Releasing the connection and sending an error response if the deletion failed
        connection.release();
        res.status(500).json({ error: "Failed to delete book" });
      }
    } catch (err) {
      // Handling any errors that occur during the book removal process
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

// Exporting the BookController function for external use
module.exports = BookController;
