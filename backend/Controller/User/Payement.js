const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3001;

app.use(express.json());

// Endpoint for getting Stripe configuration
app.get('/stripe-config', (req, res) => {
  const stripeConfig = { publicKey: process.env.STRIPE_PUBLISHABLE_KEY };
  res.json(stripeConfig);
});

// Endpoint for creating a checkout session
app.get('/create-checkout-session/:pk', async (req, res) => {
  const packageId = req.params.pk;
  const package = require('./models/Package');/* Fetch the package from the database using packageId */

  const domainUrl = 'http://localhost:3000'; // Replace with your React app's URL
  stripe.api_key = process.env.STRIPE_SECRET_KEY;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${packageId}`,
      cancel_url: `${domainUrl}/cancelled/`,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'NPR',
            product_data: {
              name: package.package_title,
            },
            unit_amount: package.package_price * 100,
          },
          quantity: 1,
        },
      ],
    });

    res.json({ sessionId: checkoutSession.id });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
