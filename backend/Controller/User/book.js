// Defining the BookController function that takes 'app' and 'db' as parameters
const BookController = (app, db) => {

  // Endpoint for adding a new book
  app.post("/addbook", async (req, res) => {
    try {
      // book details from the request body
      const {
        bookName,
        alternateTitle,
        author,
        CostPerBook,
        publisher,
        bookCountAvailable,
        bookStatus,
        shelf,
        catalogs  // Assuming catalogs are sent in the request body
      } = req.body;

      // Ensure catalogs is an array
      const catalogsArray = Array.isArray(catalogs) ? catalogs : [catalogs];

      // Acquiring a connection from the database pool and starting a transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Inserting book details into the 'books' table
        const [result] = await connection.query(`
          INSERT INTO books 
            (bookName, alternateTitle, author, CostPerBook, publisher, bookCountAvailable, bookStatus, shelf) 
          VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `, [bookName, alternateTitle, author, CostPerBook, publisher, bookCountAvailable, bookStatus, shelf]);

        // Rolling back the transaction if the book insertion fails
        if (result.affectedRows !== 1) {
          await connection.rollback();
          res.status(500).json({ error: "Failed to add book" });
          return;
        }

        const bookId = result.insertId;

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

  // Endpoint for getting all books
  
}

// Exporting the BookController function for external use
module.exports = BookController;
