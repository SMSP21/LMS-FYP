// Defining the BookController function that takes 'app' and 'db' as parameters
const BookDelete = (app, db) => {

  // Endpoint for deleting a book
  // app.delete("/deletebook/:bookId", async (req, res) => {
  //   try {
  //     // Extracting book ID from request parameters
  //     const { bookId } = req.params;

  //     // Acquiring a connection from the database pool and starting a transaction
  //     const connection = await db.getConnection();
  //     await connection.beginTransaction();

  //     try {
  //       // Deleting the book from the 'books' table
  //       const [result] = await connection.query(`
  //         DELETE FROM books
  //         WHERE id = ?
  //       `, [bookId]);

  //       // Rolling back the transaction if the book deletion fails
  //       if (result.affectedRows !== 1) {
  //         await connection.rollback();
  //         res.status(500).json({ error: "Failed to delete book" });
  //         return;
  //       }

  //       // Committing the transaction and releasing the connection
  //       await connection.commit();
  //       connection.release();

  //       // Sending success response
  //       res.status(200).json({ id: bookId, message: "Book deleted successfully" });
  //     } catch (error) {
  //       // Rolling back the transaction and releasing the connection in case of an error
  //       await connection.rollback();
  //       connection.release();
  //       throw error;
  //     }
  //   } catch (err) {
  //     // Handling any errors that occur during the book deletion process
  //     console.error(err);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });
}
module.exports = BookDelete;