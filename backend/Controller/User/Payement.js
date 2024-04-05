// Khalti API base URL
const khaltiBaseUrl = "https://a.khalti.com/api/v2/";

// Khalti secret key

const khaltiSecretKey = "test_secret_key_1ac288dae60d4fbdbe57ddc9aca1ac34";

// Route for initiating the payment request
app.post("/payement/", async (req, res) => {
  const {
    return_url,
    website_url,
    amount,
    purchase_order_id,
    purchase_order_name,
    customer_info,
    amount_breakdown,
    product_details,
  } = req.body;

  try {
    // Make a request to Khalti API to initiate the payment
    const response = await fetch(`${khaltiBaseUrl}/epayment/initiate/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url,
        website_url,
        amount,
        purchase_order_id,
        purchase_order_name,
        customer_info,
        amount_breakdown,
        product_details,
      }),
    });
    console.log(response);
    const data = await response.json();

    // Return the response from Khalti API to the frontend
    res.status(200).json(data);
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