const ReturnController = (app, db) => {
  // Endpoint to return a book
  app.post('/returnbook', async (req, res) => {
    
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();

      const { reserveId } = req.body;
      const [book] = await db.query(  "SELECT bookId from book_reservations where id = ?", [reserveId]);
    
      const bookId = book[0].bookId;
     
      const [bookAvailability] = await db.query(  "SELECT bookCountAvailable from books where id = ?", [bookId]);

      // Check if the book is already reserved
      const bookQuantity = bookAvailability[0].bookCountAvailable
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
        // Respond with the success message, fine, and days overdue
        res.status(200).json({
          success: false,
          message: "Fine needed to be paid",
          fine: fine,
          daysOverdue: daysOverdue, // Include days overdue in the response
          reserveId: reserveId
        
        });
      } else {
        // If the book is returned within one week, mark it as returned without any fine
        await connection.query(
          "DELETE from book_reservations WHERE id = ?",
          [reserveId]
        );

        // Commit the transaction
        await connection.commit();
        const newBookQuantity = bookQuantity + 1;
        // Commit the transaction
        await connection.commit();
        if (newBookQuantity == 0) {
          const [result] = await connection.query(`
          UPDATE books 
          SET 
          
            bookCountAvailable = ?,
            bookStatus = 'Available'
            
          WHERE id = ?
        `, [newBookQuantity, bookId]);
        }
        else{
        const [result] = await connection.query(`
        UPDATE books 
        SET 
        
          bookCountAvailable = ?

        WHERE id = ?
      `, [newBookQuantity, bookId]);
        }

        // Respond with the success message
        res.status(200).json({
          success: true,
          message: "Book returned successfully",
          fine: 0,
          daysOverdue: daysOverdue // Include days overdue in the response

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
    
      const [result] = await db.query("SELECT br.id as brid , bookName, author, b.id as id, userUserName,br.createdAt as ReservedAt,  s.shelfName as shelf FROM book_reservations br JOIN books b ON br.bookId = b.id JOIN user_details m ON br.memberId = m.user_id join shelf s on s.shelfId = b.shelfId WHERE userUserName = ? AND br.status = 'Issued'", [memberName]);
      
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
        console.log(daysOverdue)
        // Calculate the fine (15 rupees per day overdue)
        const fine = daysOverdue > 7 ? (daysOverdue - 7) * 10 : 0;

        // Calculate total price (assuming total_reservations is defined somewhere)
        const totalPrice = parseInt(total_reservations) * 100;

        // Send the total price and days overdue as a response
        res.status(200).json({ success: true, totalPrice, daysOverdue });
      
    } catch (error) {
        console.error('Error calculating total price:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

};

module.exports = ReturnController;
