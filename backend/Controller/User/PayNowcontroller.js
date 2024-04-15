const axios = require("axios");
const nodemailer = require("nodemailer");

const PayNowcontroller = (app, db) => {

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
  app.post("/api/epayment/initiate/", async (req, res) => {
    
    const order = req.body;
    const userId = order.UserDetail;
       
    const connection = await db.getConnection();
    const [userDetails] = await connection.query('SELECT userEmail, userUserName FROM user_details WHERE userUserName = ?', [userId]);

 
    for (let i = 0; i < order.id.length; i++) {
      const book = order.id[i];
      console.log(book.brid);
      const connection = await db.getConnection();
  
      await connection.query(
        'INSERT INTO checkout (id, brId) VALUES (1, ?)',
        [book.brid]
      );
    }
  
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
          "return_url": "http://localhost:5002/api/khalti/callback",
          "website_url": "http://localhost:5002/",
          "amount": order.products.amount * 100,
          "purchase_order_id": "1",
          "purchase_order_name": "test",
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
         // Send payment confirmation email
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
             ${order.id.map(book => `
               <li>Title: <strong>${book.bookName}</strong>, Price: <strong>Rs 100</strong></li>
             `).join('')}
           </ul>
           <p style="font-weight: bold;">Total Amount: <span style="font-size: 18px;">Rs ${order.products.amount}</span></p>
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
  app.get("/api/khalti/callback", async (req, res) => {
    try {
      const { txnId, pidx, amount, purchase_order_id, transaction_id, message } = req.query;
     
      // Find the order by payment ID
      const connection = await db.getConnection();
      const [result] = await db.query('SELECT brid  from checkout');
      console.log(result);

      for (let i = 0; i < result.length; i++) {
        // Access each object in the array
        const reservation = result[i];
        console.log(reservation.brid);
        const [update] = await connection.query(`
          UPDATE book_reservations
          SET 
            status = 'Issued',
            createdAt = NOW()
          WHERE id = ?
        `, [reservation.brid]);
      }

      // Remove the checkout entry
      await connection.query('DELETE FROM checkout WHERE id = 1');

      // Redirect to Return-book endpoint
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
        payment_status:"paid",
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

module.exports = PayNowcontroller;
