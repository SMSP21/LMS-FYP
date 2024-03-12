// Importing required modules
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initializing Express app
const app = express();
const port = 5002;

// Middleware to parse JSON in the request body
app.use(express.json());

// Endpoint for getting Stripe configuration
app.get('/stripe-config', (req, res) => {
  // Providing the Stripe public key to the client
  const stripeConfig = { publicKey: process.env.STRIPE_PUBLISHABLE_KEY };
  res.json(stripeConfig);
});

// Endpoint for creating a checkout session
app.get('/create-checkout-session/:pk', async (req, res) => {
  // Extracting packageId from the request parameters
  const packageId = req.params.pk;

  // Importing the Package model (assuming it's a module) to fetch package details
  const package = require('./models/Package'); /* Fetch the package from the database using packageId */

  // Setting the domain URL for success and cancel URLs
  const domainUrl = 'http://localhost:3000'; // Replace with your React app's URL

  // Setting up the Stripe API key
  stripe.api_key = process.env.STRIPE_SECRET_KEY;

  try {
    // Creating a checkout session using the Stripe API
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${packageId}`,
      cancel_url: `${domainUrl}/cancelled/`,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          // Adding the product details to the checkout session
          price_data: {
            currency: 'usd',
            product_data: {
              name: package.package_title,
            },
            unit_amount: package.package_price * 100, // Converting to cents as Stripe uses the smallest currency unit
          },
          quantity: 1,
        },
      ],
    });

    // Sending the checkout session ID back to the client
    res.json({ sessionId: checkoutSession.id });
  } catch (error) {
    // Handling errors and sending an error response
    res.json({ error: error.message });
  }
});

// Starting the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
