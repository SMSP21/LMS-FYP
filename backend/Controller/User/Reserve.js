const express = require('express');
const app = express();


const ReserveController = (app, db) => {
  app.post("/reservebook", async (req, res) => {
    try {
      const { memberName, bookName, authorName } = req.body;

      // Check if required fields are provided
      if (!memberName || !(bookName || authorName)) {
        return res.status(400).json({ success: false, message: "Member name and either book name or author name are required" });
      }
  
      // Query to find book ID based on provided book name or author name
      const query = bookName ? "SELECT id FROM books WHERE bookName = ?" : "SELECT id FROM books WHERE author = ?";
      const queryParams = [bookName || authorName];

      // Execute the query to find the book ID
      const [result] = await db.query(query, queryParams);

      // If the book is not found, return an error response
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }

      const bookId = result[0].id;
      const [bookAvailability] = await db.query(  "SELECT bookCountAvailable from books where id = ?", [bookId]);

      // Check if the book is already reserved
      const bookQuantity = bookAvailability[0].bookCountAvailable
      // If the book is already reserved, return an error response
     
      if (bookQuantity == 0) {
        return res.status(400).json({ success: false, message: "Book is not available for reservation" });
      }

    
      // Query to find member ID based on provided member name
      const [memberDetails] = await db.query("SELECT user_id FROM user_details WHERE userUsername = ?", [memberName]);
     
      // If member details are not found, return an error response
      if (memberDetails.length === 0) {
        return res.status(404).json({ success: false, message: "Member details not found" });
      }

      const memberId = memberDetails[0].user_id;
      const [existingReservation] = await db.query( "SELECT * FROM book_reservations WHERE memberId = ? AND bookId = ? AND status = 'reserved' OR status = 'Issued'" , [memberId,bookId]);
      if (existingReservation.length > 0) {
        return res.status(404).json({ success: false, message: "You have already reserved this book." });
      }
      // Start a database transaction...
      const connection = await db.getConnection();

      try {
        // Begin the transaction
        await connection.beginTransaction();

        // Insert reservation details into the book_reservations table
        await connection.query(
          'INSERT INTO book_reservations (bookId, memberId, status) VALUES (?, ?, ?)',
          [bookId, memberId, 'reserved']
        );
          const newBookQuantity = bookQuantity - 1;
        // Commit the transaction
        await connection.commit();
        if (newBookQuantity == 0) {
          const [result] = await connection.query(`
          UPDATE books 
          SET 
          
            bookCountAvailable = ?,
            bookStatus = 'Unavailable'
            
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
  app.get('/reserveTotal', async (req, res) => {
    try {
      // Query the database to get the total count of reservations
      
      const [result] = await db.query('SELECT COUNT(*) AS total FROM book_reservations');
      const totalReservations = result[0].total;
      return res.json({ success: true, totalReservations });
    } catch (error) {
      console.error('Error fetching total reservations:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  app.get('/reservebookget', async (req, res) => {
    try {
      
      // Query the database to get the total count of reservations
      
      const [result] = await db.query('SELECT br.id as brid , bookName, author, b.id as id, userUserName, shelf from  book_reservations br join books b on br.bookId = b.id join user_details m on br.memberId = m.user_id');
      
      res.status(200).json({ result });
    } catch (error) {
      console.error('Error fetching total reservations:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  app.get('/reservebookget1', async (req, res) => {
    try {
     
      const { memberName } = req.query; // Access query parameters using req.query
    
      const [result] = await db.query("SELECT br.id as brid , bookName, author, b.id as id, userUserName,  shelf FROM book_reservations br JOIN books b ON br.bookId = b.id JOIN user_details m ON br.memberId = m.user_id WHERE userUserName = ? AND br.status = 'reserved'", [memberName]);
      
      res.status(200).json({ result });
    } catch (error) {
      console.error('Error fetching total reservations:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  app.delete('/deleteReservation/:id', async (req, res) => {
    const id = req.params.id;
    const connection = await db.getConnection();
    try {

      // Find the reservation by ID
      const [result] = await db.query("SELECT bookId from book_reservations WHERE id = ?", [id]);
      const bookId = result[0].bookId;
      
      const [bookAvailability] = await db.query(  "SELECT bookCountAvailable from books where id = ?", [bookId]);
      
      // Check if the book is already reserved
      const bookQuantity = bookAvailability[0].bookCountAvailable
      await db.query("DELETE FROM book_reservations WHERE id = ?", [id]);
     

      const newBookQuantity = bookQuantity + 1;
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
      // Return a success response
      return res.status(200).json({ success: true, message: 'Reservation deleted successfully' });

    } catch (error) {
      // If an error occurs, return a 500 Internal Server Error response
      console.error('Error deleting reservation:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  app.delete('/cancelReservation/:id', async (req, res) => {
    const id = req.params.id;
    const connection = await db.getConnection();
    try {
   
      // Find the reservation by ID
      const [result] = await db.query("SELECT bookId from book_reservations WHERE id = ?", [id]);
      const bookId = result[0].bookId;
      
      const [bookAvailability] = await db.query(  "SELECT bookCountAvailable from books where id = ?", [bookId]);
     
      // Check if the book is already reserved
      const bookQuantity = bookAvailability[0].bookCountAvailable
      await db.query("DELETE FROM book_reservations WHERE id = ?", [id]);
     

      const newBookQuantity = bookQuantity + 1;
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
      // Return a success response
      return res.status(200).json({ success: true, message: 'Reservation deleted successfully' });

    } catch (error) {
      // If an error occurs, return a 500 Internal Server Error response
      console.error('Error deleting reservation:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  app.get('/calculateTotalPrice', async (req, res) => {
    try {
      const { username } = req.query; 

    
      // Fetch reserved books from the database
      const [user_details] = await db.query("SELECT user_id FROM user_details WHERE userUsername = ?", [username]);

      const user_id = user_details[0].user_id;
      const [reservedBooksRows] = await db.query("SELECT count(id) As totalreservations FROM book_reservations where memberId = ? AND  status = 'reserved'",[user_id]);
      const total_reservations = reservedBooksRows[0].totalreservations;
      // Calculate total price
      const totalPrice = parseInt(total_reservations)*100
  
      // Send the total price as a response
      res.status(200).json({ success: true, totalPrice });
    } catch (error) {
      console.error('Error calculating total price:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  app.post('/payNowTotal', async (req, res) => {
    try {
      // Process payment logic here
      // For example, you can integrate with a payment gateway or process payments directly
      // Here, we're simulating a successful payment
      const totalPrice = req.body.totalPrice;
      // Implement your payment processing logic here
      console.log(`Payment processed successfully for total price: ${totalPrice}`);
      res.status(200).json({ success: true, message: 'Payment processed successfully' });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  
};


// Endpoint to get the total number of reservations




module.exports = ReserveController;
