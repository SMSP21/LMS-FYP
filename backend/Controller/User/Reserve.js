// Defining the ReserveController function that takes 'app' and 'db' as parameters
const ReserveController = (app, db) => {
  
  // Handling POST requests to "/reservebook/:bookId" endpoint for book reservation
  app.post("/reservebook/:bookId", async (req, res) => {
    try {
      // Extracting memberId, rawBookId, and parsing bookId from the request
      const memberId = req.body.memberId; // Assuming you have a way to identify the member making the reservation
      const rawBookId = req.params.bookId; // Get the raw bookId before parsing
      const bookId = parseInt(rawBookId, 10); // Parse the bookId to a number here

      // Log rawBookId for debugging
      console.log('Received rawBookId:', rawBookId);

      // Ensure bookId is not NaN
      if (isNaN(bookId)) {
        console.error('Invalid BookId:', bookId);
        return res.status(400).json({ success: false, message: "Invalid BookId" });
      }

      // Log parsedBookId for debugging
      console.log('Received and parsed bookId:', bookId);

      // Query the database to check if the book with the specified bookId exists
      const [existingBook] = await db.query("SELECT * FROM books WHERE id = ?", [bookId]);

      // Debug log for existingBook
      console.log('Existing book:', existingBook);

      // If the book is not found, return an error response
      if (existingBook.length === 0) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }

      // Check if the book is already reserved
      const [existingReservation] = await db.query("SELECT * FROM book_reservations WHERE bookId = ? AND status = 'reserved'", [bookId]);

      console.log('Existing reservation:', existingReservation);

      // If the book is already reserved, return an error response
      if (existingReservation.length > 0) {
        return res.status(400).json({ success: false, message: "Book is already reserved" });
      }

      // Check the userType of the member
      const [userDetails] = await db.query("SELECT userType FROM user_details WHERE user_id = ?", [memberId]);

      // If user details are not found, return an error response
      if (userDetails.length === 0) {
        return res.status(404).json({ success: false, message: "User details not found" });
      }

      const userType = userDetails[0].userType;

      // Check userType and proceed accordingly
      if (userType === 'member') {
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
      } else {
        // If the user does not have permission to reserve books, return an error response
        return res.status(403).json({ success: false, message: "User does not have permission to reserve books" });
      }
    } catch (error) {
      // Handle any errors that occur during the book reservation process
      console.error("Error during book reservation:", error);
      res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
  });
};

// Exporting the ReserveController function for external use
module.exports = ReserveController;
