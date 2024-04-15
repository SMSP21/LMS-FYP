const axios = require("axios");
const nodemailer = require("nodemailer");

const FineController = (app, db) => {

  // Khalti API base URL
  const khaltiBaseUrl = "https://a.khalti.com/api/v2/";

  // Khalti secret key
  const khaltiSecretKey = "test_public_key_b9caa4ebc2124499836b2f0252fffdeb";

  // Create a transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "supratikmspradhan@gmail.com",
      pass: "iugz owfb glta dvfe",
    },
  });

  // Route for initiating the payment request
  app.post("/api/epayment/initiate1/", async (req, res) => {
    const order = req.body;
    console.log("hello", order.id)
    const userId = order.UserDetail;

    const connection = await db.getConnection();
    const [userDetails] = await connection.query('SELECT userEmail, userUserName FROM user_details WHERE userUserName = ?', [userId]);

    try {
      const request = require('request');
      const options = {
        'method': 'POST',
        'url': 'https://a.khalti.com/api/v2/epayment/initiate/',
        'headers': {
          'Authorization': 'key 61cf9f7f0c994d579d38fd97624b6a1a',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "return_url": "http://localhost:5002/api/khalti/callback1",
          "website_url": "http://localhost:5002/",
          "amount": order.products.amount * 100,
          "purchase_order_id": order.id,
          "purchase_order_name": order.products.product,
        })
      };

      request(options, function (error, response) {
        if (error) throw new Error(error);

        const data = JSON.parse(response.body);

        // Retrieve user email and username
        // Check if userDetails is not empty
        if (userDetails && userDetails.length > 0) {
          const userEmail = userDetails[0].userEmail;
          const userUserName = userDetails[0].userUserName;

          // Send payment confirmation email
          const mailOptions = {
            from: "supratikmspradhan@gmail.com",
            to: userEmail,
            subject: "Payment Successful",
            html: `<p>Dear <strong>${userUserName}</strong>,</p>
                   <p>Your payment has been successfully completed for the following order:</p>
                   <div style="font-size: 16px;">
                     <p style="font-weight: bold;">Order Details:</p>
                     <ul style="list-style-type: none; padding: 0;">
                       
                         <li>Title: <strong>${order.products.product}</strong>
                    
                     </ul>
                     <p style="font-weight: bold;">Total Fine: <span style="font-size: 18px;">Rs ${order.products.amount}</span></p>
                   </div>
                   <p>Thank you for your purchase!</p>
                   <p>Regards,<br>Library Management System</p>`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }

        return res.json({ success: true, data: data });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/khalti/callback
  app.get("/api/khalti/callback1", async (req, res) => {
    try {
      const { txnId, pidx, amount, purchase_order_id, transaction_id, message } = req.query;
      const connection = await db.getConnection();
     

      const [book] = await db.query(  "SELECT bookId from book_reservations where id = ?", [purchase_order_id]);
    
      const bookId = book[0].bookId;
     
      const [bookAvailability] = await db.query(  "SELECT bookCountAvailable from books where id = ?", [bookId]);

      // Check if the book is already reserved
      const bookQuantity = bookAvailability[0].bookCountAvailable
       
      await connection.query(
        "DELETE from book_reservations WHERE id = ?",
        [purchase_order_id]
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
      res.redirect("http://localhost:3001/Return-book");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // PUT /api/orders/:id/payment
  app.put("/api/orders/:id/payment", async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, {
        payment_status: "paid",
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Payment result updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = FineController;
