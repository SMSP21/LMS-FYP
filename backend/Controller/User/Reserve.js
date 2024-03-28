// Define the ReserveController function that takes 'app' and 'db' as parameters
const ReserveController = (app, db) => {
  // Handling POST requests to "/reservebook/:bookId" endpoint for book reservation
  app.post("/reservebook", async (req, res) => {
    try {
      const { memberName, bookName, authorName } = req.body;

      // Check if bookName or authorName is provided
      if (!bookName && !authorName) {
        return res.status(400).json({ success: false, message: "Book name or author name is required" });
      }

      let query, queryParams;

      // Determine the query based on whether bookName or authorName is provided
      if (bookName) {
        query = "SELECT id FROM books WHERE bookName = ?";
        queryParams = [bookName];
      } else {
        query = "SELECT id FROM books WHERE authorName = ?";
        queryParams = [authorName];
      }

      // Execute the query to find the book ID
      const [result] = await db.query(query, queryParams);

      // If the book is not found, return an error response
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }

      const bookId = result[0].id;

      // Check if the book is already reserved
      const [existingReservation] = await db.query("SELECT * FROM book_reservations WHERE bookId = ? AND status = 'reserved'", [bookId]);

      // If the book is already reserved, return an error response
      if (existingReservation.length > 0) {
        return res.status(400).json({ success: false, message: "Book is already reserved" });
      }

      // Query the database to retrieve the member ID based on the provided member name
      const [memberDetails] = await db.query("SELECT user_id FROM user_details WHERE user_name = ?", [memberName]);

      // If member details are not found, return an error response
      if (memberDetails.length === 0) {
        return res.status(404).json({ success: false, message: "Member details not found" });
      }

      const memberId = memberDetails[0].user_id;

      // Start a database transaction
      const connection = await db.getConnection();

      try {
        // Begin the transaction
        await connection.beginTransaction();

        // Insert reservation details into the book_reservations table
        await connection.query(
          'INSERT INTO book_reservations (bookId, memberId, status) VALUES (?, ?, ?)',
          [bookId, memberId, 'reserved']
        );

        // Commit the transaction
        await connection.commit();

        // Reservation successful
        console.log("Book Reserved Successfully");
        res.status(200).json({ success: true, message: "Book reserved successfully" });
      } catch (err) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error("Error during book reservation:", err);
        res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
      } finally {
        // Release the connection
        connection.release();
      }
    } catch (error) {
      // Handle any errors that occur during the book reservation process
      console.error("Error during book reservation:", error);
      res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
  });
};

// Export the ReserveController function for external use
module.exports = ReserveController;
