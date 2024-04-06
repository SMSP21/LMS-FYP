const IssueController = (app, db) => {
    app.post("/issuebook", async (req, res) => {
      try {
        
        const connection = await db.getConnection();
        await connection.beginTransaction();
        console.log("hello")

        const { reserveId } = req.body;
        
        console.log(reserveId)
       


        
        const [result] = await connection.query(`
        UPDATE book_reservations 
        SET 
        
          status = 'Issued',
          createdAt =  CURRENT_TIMESTAMP
          
        WHERE id = ?
      `, [ reserveId]);
     
        // Commit the transaction after the update
        await connection.commit();

        res.status(200).json({ success: true, message: "Book issued successfully" });
      } catch (error) {
        // Handle any errors that occur during the book reservation process
        console.error("Error during book reservation:", error);
        res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
      }
    });
};

    module.exports = IssueController;
