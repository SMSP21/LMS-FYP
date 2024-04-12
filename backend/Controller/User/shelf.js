const ShelfController = (app, db) => {
    app.post("/addshelf", async (req, res) => {
        try {
            const shelfData = req.body;
            const shelfName = shelfData.shelfName
            // Check if shelfName already exists
            const [existingShelf] = await db.query("SELECT * FROM shelf WHERE shelfName = ?", [shelfName]);
            
            if (existingShelf.length > 0) {
                return res.status(400).json({ error: "Shelf with the same name already exists" });
            }
    
            // Acquiring a connection from the database pool
            const connection = await db.getConnection();
    
            // Starting a transaction
            await connection.beginTransaction();
    
            try {
                // Inserting shelf details into the 'books' table
                const [result] = await connection.query(
                    "INSERT INTO shelf (shelfName) VALUES (?)",
                    [shelfName]
                );
    
                // Committing the transaction if successful
                await connection.commit();
                connection.release();
    
                // Sending success response
                res.status(200).json({ id: result.insertId, message: "Shelf added successfully" });
            } catch (error) {
                // Rolling back the transaction and releasing the connection in case of an error
                await connection.rollback();
                connection.release();
                throw error;
            }
        } catch (error) {
            // Handling any errors that occur during the shelf addition process
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    

    app.delete('/deleteShelf/:id', async (req, res) => {
        const shelfId = req.params.id;
        const connection = await db.getConnection();
        try {
    
          // Find the reservation by ID
          const [result] = await db.query("SELECT shelfId from shelf WHERE shelfId = ?", [shelfId]);
          
          
          
          await db.query("DELETE FROM shelf WHERE shelfId = ?", [shelfId]);
         
    
         
          // Return a success response
          return res.status(200).json({ success: true, message: 'Shelf deleted successfully' });
    
        } catch (error) {
          // If an error occurs, return a 500 Internal Server Error response
          console.error('Error deleting Shelf:', error);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
      });
      app.get('/shelfget', async (req, res) => {
        try {
          
          // Query the database to get the total count of reservations
          
          const [result] = await db.query('SELECT * from shelf');
          
          res.status(200).json({ result });
        } catch (error) {
          console.error('Error fetching total shelf:', error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      });
      app.post('/searchShelf', async (req, res) => {
        try {
          const { searchTerm, searchOption } = req.body;
      
          if (!searchTerm) {
            return res.status(400).json({
              error: 'Search term is required'
            });
          }
          
          let query;
        
          if (searchOption === 'name') {
            query = "Select * from shelf where shelfName LIKE ?";
          
          } else {
            return res.status(400).json({
              error: 'Invalid search option'
            });
            
          }
          
          const searchValue = `%${searchTerm}%`;
          
          const [results] = await db.query(query, [searchValue]);
          
          if (results.length === 0) {
            return res.status(404).json({
              error: 'No Shelf found'
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

      app.get('/shelfTotal', async (req, res) => {
        try {
          // Query the database to get the total count of shelves
          const [result] = await db.query('SELECT COUNT(*) AS totalShelf FROM shelf');
          const totalShelf = result[0].totalShelf;
          return res.json({ success: true, totalShelf });
        } catch (error) {
          console.error('Error fetching total Shelf:', error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      });
      
};

module.exports = ShelfController;
