const ReturnController = (app, db) => {
  // Endpoint to return a book
  app.post('/returnbook', async (req, res) => {
    try {
      console.log("hello")
      const connection = await db.getConnection();
      await connection.beginTransaction();

      const { reserveId } = req.body;

      // Retrieve the reservation date from the database
      const [result] = await connection.query(
        "SELECT createdAt FROM book_reservations WHERE id = ?",
        [reserveId]
      );
      const reservationDate = result[0].createdAt;

      // Calculate the time difference in milliseconds
      const currentDate = new Date();
      const timeDifference = currentDate - new Date(reservationDate);

      // Calculate the number of days overdue
      const daysOverdue = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      // Calculate the fine (15 rupees per day overdue)
      const fine = daysOverdue > 7 ? (daysOverdue - 7) * 10 : 0;

      // If the fine is greater than zero, apply it and update the database
      if (fine > 0) {
       
        
         
        // Respond with the success message and fine
        res.status(200).json({
          success: false,
          error: "Fine needed to be payed",
          fine: fine
        });
      } else {
        // If the book is returned within one week, mark it as returned without any fine
        await connection.query(
          "DELETE from book_reservations WHERE id = ?",
          [reserveId]
        );

        // Commit the transaction
        await connection.commit();

        // Respond with the success message
        res.status(200).json({
          success: true,
          message: "Book returned successfully",
          fine: 0
        });
      }
    } catch (error) {
      // Handle any errors that occur during the book return process
      console.error("Error during book return:", error);
      res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
  });
  app.get('/Issuedbookget', async (req, res) => {
    try {
     
      const { memberName } = req.query; // Access query parameters using req.query
    
      const [result] = await db.query("SELECT br.id as brid , bookName, author, b.id as id, userUserName,  shelf FROM book_reservations br JOIN books b ON br.bookId = b.id JOIN user_details m ON br.memberId = m.user_id WHERE userUserName = ? AND br.status = 'Issued'", [memberName]);
      
      res.status(200).json({ result });
    } catch (error) {
      console.error('Error fetching total reservations:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  app.get('/calculateFine', async (req, res) => {
    try {
      const { username } = req.query; 

    
  
      const { reserveId } = req.body;

      // Retrieve the reservation date from the database
      const [result] = await connection.query(
        "SELECT createdAt FROM book_reservations WHERE id = ?",
        [reserveId]
      );
      const reservationDate = result[0].createdAt;

      // Calculate the time difference in milliseconds
      const currentDate = new Date();
      const timeDifference = currentDate - new Date(reservationDate);

      // Calculate the number of days overdue
      const daysOverdue = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      // Calculate the fine (15 rupees per day overdue)
      const fine = daysOverdue > 7 ? (daysOverdue - 7) * 10 : 0;
      // Calculate total price
      const totalPrice = parseInt(total_reservations)*100
  
      // Send the total price as a response
      res.status(200).json({ success: true, totalPrice });
    } catch (error) {
      console.error('Error calculating total price:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
};

module.exports = ReturnController;
