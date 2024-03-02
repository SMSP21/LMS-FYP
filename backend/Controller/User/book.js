const BookController = (app, db) => {

    app.post("/addbook", async (req, res) => {
        try {
          const {
            bookName,
            alternateTitle,
            author,
            language,
            publisher,
            bookCountAvailable,
            bookStatus,
            catalogs
          } = req.body;
      
          const connection = await db.getConnection();
          await connection.beginTransaction();
      
          try {
            // Insert into 'books' table
            const [result] = await connection.query(`
              INSERT INTO books 
                (bookName, alternateTitle, author, language, publisher, bookCountAvailable, bookStatus) 
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [bookName, alternateTitle, author, language, publisher, bookCountAvailable, bookStatus]);
      
            if (result.affectedRows !== 1) {
              await connection.rollback();
              res.status(500).json({ error: "Failed to add book" });
              return;
            }
      
            const bookId = result.insertId;
      
            // Insert into 'book_catalog' table (if applicable)
            if (catalogs && catalogs.length > 0) {
              const catalogsInsertPromises = catalogs.map(async (catalogId) => {
                await connection.query(`
                  INSERT INTO catalog (bookId, catalogId) 
                  VALUES (?, ?)
                `, [bookId, catalogId]);
              });
      
              await Promise.all(catalogsInsertPromises);
            }
      
            await connection.commit();
            connection.release();
      
            res.status(200).json({ id: bookId, message: "Book added successfully" });
          } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
      

  // Get all books
  app.get("/allbooks", async (req, res) => {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.query("SELECT * FROM books");
      connection.release();
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  app.get("/getbook/:id", async (req, res) => {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
      connection.release();
  
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  // Updating book
  app.put("/updatebook/:id", async (req, res) => {
    try {
      const connection = await db.getConnection();
      const book = req.body;
      await connection.query("UPDATE books SET ? WHERE id = ?", [book, req.params.id]);
      connection.release();
      res.status(200).json({ message: "Book details updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  // Remove book
  app.delete("/removebook/:id", async (req, res) => {
    try {
      const connection = await db.getConnection();
      const bookId = req.params.id;
  
      // Check if the book with the given ID exists
      const [existingBook] = await connection.query("SELECT * FROM books WHERE id = ?", [bookId]);
  
      if (existingBook.length === 0) {
        connection.release();
        return res.status(404).json({ error: "Book not found" });
      }
  
      // Delete book from the books table
      const [result] = await connection.query("DELETE FROM books WHERE id = ?", [bookId]);
  
      if (result.affectedRows === 1) {
       
        await connection.query("DELETE FROM catalog WHERE bookId = ?", [bookId]);
  
        connection.release();
        res.status(200).json({ message: "Book has been deleted" });
      } else {
        connection.release();
        res.status(500).json({ error: "Failed to delete book" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
}

module.exports = BookController;