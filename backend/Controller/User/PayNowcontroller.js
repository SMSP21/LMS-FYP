const axios = require("axios"); 

const PayNowcontroller = (app, db) => {
// Khalti API base URL
const khaltiBaseUrl = "https://a.khalti.com/api/v2/";

// Khalti secret key
// const khaltiSecretKey = '636902e93e7446a08dd2008a1e80890c';
const khaltiSecretKey = "test_public_key_b9caa4ebc2124499836b2f0252fffdeb";

// Route for initiating the payment request
app.post("/api/epayment/initiate/", async (req, res) => {
    
    const order = req.body;

  
  try {
    const request = require('request');
    const options = {
        'method': 'POST',
        'url': 'https://khalti.com/api/v2/epayment/initiate/',
        'headers': {
        'Authorization': 'key test_secret_key_6d689160e71545ef8ae079702bba6c6c',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        "return_url": "http://localhost:5002/",
        "website_url": "http://localhost:5002/",
        "amount": "1000",
        "purchase_order_id": "Order01",
        "purchase_order_name": "test",
        "customer_info": {
            "name": "Ram Bahadur",
            "email": "test@khalti.com",
            "phone": "9800000001"
        }
        })
    
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/khalti/callback
app.post("/api/khalti/callback", async (req, res) => {
  try {
    const paymentData = req.body;

    // Find the order by payment ID
    const order = await Order.findOne({ "paymentResult.id": paymentData.idx });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order payment result
    order.paymentResult = {
      id: paymentData.idx,
      status: paymentData.state,
      update_time: paymentData.updated_at,
      email_address: paymentData.email,
    };

    // Save the updated order
    await order.save();

    res
      .status(200)
      .json({ message: "Payment callback processed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/orders/:id/payment
app.put("/api/orders/:id/payment", async (req, res) => {
  try {
    // const { id, status, update_time, email_address } = req.body;

    const order = await Order.findByIdAndUpdate(req.params.id, {
      payment_status:"paid",
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //-- Remove finished cart and cart item


    //-- Find cart by user id 
    // delete all cart item using cart id
    //  delte cart using cart id
    // await Cart.deleteMany({userId:order.order})

    res.status(200).json({ message: "Payment result updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

};

module.exports = PayNowcontroller;
