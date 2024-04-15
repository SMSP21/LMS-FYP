// Defining the BookController function that takes 'app' and 'db' as parameters
const BookController = (app, db) => {

  // Endpoint for adding a new book
  app.post("/addbook", async (req, res) => {
    try {
      // book details from the request body
      const {
        ISBN,
        bookName,
        alternateTitle,
        author,
        
        publisher,
        bookCountAvailable,
        bookStatus,
        shelfId,
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
            (ISBN, bookName, alternateTitle, author,  publisher, bookCountAvailable, bookStatus, shelfId) 
          VALUES (?, ?, ?, ?,  ?, ?, ?,?)
        `, [ISBN, bookName, alternateTitle, author,  publisher, bookCountAvailable, bookStatus, shelfId]);

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

 //user deyails
 app.get('/userTotal', async (req, res) => {
  try {
    // Query the database to get the total count of reservations
    
    const [result] = await db.query('SELECT COUNT(*) AS total FROM user_details where userType = "member"');
    const totalUsers = result[0].total;
    return res.json({ success: true, totalUsers});
  } catch (error) {
    console.error('Error fetching total Users:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
app.get('/userget', async (req, res) => {
  try {
    
    // Query the database to get the total count of reservations
    
    const [result] = await db.query('SELECT * from user_details where userType = "member"');
    
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/deleteUser/:id', async (req, res) => {
  const user_id = req.params.id;
  const connection = await db.getConnection();
  try {

    // Find the user by ID
    const [result] = await db.query("SELECT user_id from user_details WHERE user_id = ?", [user_id]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const foundUserId = result[0].user_id;
   
    await db.query("DELETE FROM user_details WHERE user_id = ?", [foundUserId]);
   
    // Return a success response
    return res.status(200).json({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error('Error deleting User:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/searchUsers', async (req, res) => {
  try {
    const { searchTerm, searchOption } = req.body;

    if (!searchTerm) {
      return res.status(400).json({
        error: 'Search term is required'
      });
    }
    
    let query;

    if (searchOption === 'userFullName') {
      query = "SELECT * from user_details where userFullName LIKE ?"
    } else if (searchOption === 'userUserName') {
      query = "SELECT * from user_details where userUserName LIKE ?";
    } else {
      return res.status(400).json({
        error: 'Invalid search option'
      });
    }
    
    const searchValue = `%${searchTerm}%`;
    
    const [results] = await db.query(query, [searchValue]);

    if (results.length === 0) {
      return res.status(404).json({
        error: 'No users found'
      });
    }
    
    res.json(results); 
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

  
}

// Exporting the BookController function for external use
module.exports = BookController;
