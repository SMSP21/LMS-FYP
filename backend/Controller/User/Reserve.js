// Endpoint for reserving a book

const ReserveController = (app, db) => {
app.post("/reservebook/:bookId", async (req, res) => {
    try {
      const memberId = req.body.memberId; // Assuming you have a way to identify the member making the reservation
      const bookId = req.params.bookId;
  
      // Check the userType of the member
      const [userDetails] = await db.query("SELECT userType FROM user_details WHERE user_id = ?", [memberId]);
  
      if (userDetails.length === 0) {
        return res.status(404).json({ success: false, message: "User details not found" });
      }
  
      const userType = userDetails[0].userType;
  
      // Check if the book is already reserved
      const [existingReservation] = await db.query("SELECT * FROM book_reservations WHERE bookId = ? AND status = 'reserved'", [bookId]);
  
      if (existingReservation.length > 0) {
        return res.status(400).json({ success: false, message: "Book is already reserved" });
      }
  
      // Check userType and proceed accordingly
      if (userType === 'member') {
        // Start a transaction
        const connection = await db.getConnection();
  
        try {
          await connection.beginTransaction();
  
          // Insert reservation details
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
          throw err;
        } finally {
          // Release the connection
          connection.release();
        }
      } else {
        return res.status(403).json({ success: false, message: "User does not have permission to reserve books" });
      }
    } catch (error) {
      console.error("Error during book reservation:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
}

module.exports = ReserveController;