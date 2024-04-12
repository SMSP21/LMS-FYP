
const axios = require("axios");
const crypto = require("crypto");



const OrderController = (app, db) => {

app.post('/createOrder', async (req, res) => {
  try {
  
   
    const order = req.body;
    
   /*  const signature = createSignature(
      `total_amount=${order.prodcuts.amount},transaction_uuid=${order.id},product_code=EPAYTEST`
    ); */
   

    const formData = {
        return_url: "http://localhost:5002/khalti/callback",
        website_url: "http://localhost:5002",
        amount: order.products.amount * 100,//paisa
        purchase_order_id: order.id,
        purchase_order_name: order.products.name,
      };
   

      callKhalti(formData, req, res);
      console.log("hello")
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
});

exports.updateOrderAfterPayment = async (req, res, next) => {
  try {
    console.log(req.body);
    const order = await orderService.findById(req.transaction_uuid);
    order.status = "paid";
    order.transaction_code = req.transaction_code;

    await orderService.save(order);
    res.redirect("http://localhost:5173");
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

/* exports.createSignature = (message) => {
    console.log("hello")
  const secret = "8gBm/:&EnhH.1/q"; //different in production
  // Create an HMAC-SHA256 hash
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
}; */
};
module.exports = OrderController;