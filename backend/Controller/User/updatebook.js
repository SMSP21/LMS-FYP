// Defining the BookController function that takes 'app' and 'db' as parameters
const updatebook = (app, db) => {

    // Endpoint for updating book details
   // Endpoint for updating book details
app.put("/updatebook/:bookId", async (req, res) => {
  try {
    // Extracting book ID from request parameters
    const { bookId } = req.params;

    // Destructuring updated book details from the request body
    const {
      ISBN,
      bookName,
      alternateTitle,
      author,
     
      publisher,
      bookCountAvailable,
      bookStatus,
      shelfId
    } = req.body;

    // Acquiring a connection from the database pool and starting a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Fetching book details from the 'books' table based on the provided book ID
      const [bookData] = await connection.query(`
        SELECT * FROM books WHERE id = ?
      `, [bookId]);

      // Checking if the book with the provided ID exists
      if (bookData.length === 0) {
        await connection.rollback();
        res.status(404).json({ error: "Book not found" });
        return;
      }

      // Updating book details in the 'books' table
      const [result] = await connection.query(`
        UPDATE books 
        SET 
        ISBN = ?,
          bookName = ?,
          alternateTitle = ?,
          author = ?,
          
          publisher = ?,
          bookCountAvailable = ?,
          bookStatus = ?,
          shelfId = ?
        WHERE id = ?
      `, [ISBN, bookName, alternateTitle, author,  publisher, bookCountAvailable, bookStatus, shelfId, bookId]);

      // Rolling back the transaction if the book update fails
      if (result.affectedRows !== 1) {
        await connection.rollback();
        res.status(500).json({ error: "Failed to update book" });
        return;
      }

      // Committing the transaction and releasing the connection
      await connection.commit();
      connection.release();

      // Sending success response
      res.status(200).json({ id: bookId, message: "Book updated successfully" });
    } catch (error) {
      // Rolling back the transaction and releasing the connection in case of an error
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (err) {
    // Handling any errors that occur during the book update process
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

    // Endpoint for fetching book data by ID
    app.get("/book/:bookId", async (req, res) => {
      try {
        // Extracting book ID from request parameters
        const { bookId } = req.params;
  
        // Acquiring a connection from the database pool
        const connection = await db.getConnection();
  
        // Fetching book details from the 'books' table based on the provided book ID
        const [bookData] = await connection.query(`
          SELECT * FROM books WHERE id = ?
        `, [bookId]);
  
        // Releasing the connection
        connection.release();
  
        // Checking if the book with the provided ID exists
        if (bookData.length === 0) {
          res.status(404).json({ error: "Book not found" });
          return;
        }
  
        // Sending the book data as a response
        res.status(200).json(bookData[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

   
    
  }
  
  // Exporting the BookController function for external use
  module.exports = updatebook;
  