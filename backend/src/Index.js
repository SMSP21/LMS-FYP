const express = require('express');
const mysql = require('mysql2/promise'); // Import the promise-based version
const UserRegisterController = require('../Controller/User/UserRegisterController');
const BookController = require('../Controller/User/book');
const cors = require('cors');
const ReserveController = require('../Controller/User/Reserve');
const UserLoginController = require('../Controller/User/UserLoginController');
const BookUpdate = require('../Controller/User/updatebook');
const bookSearch = require('../Controller/User/bookSearch');


const UserProfile = require('../Controller/User/userProfile')
const app = express();
const port = 5002;

// Enable CORS
app.use(cors());
app.use(express.json());

// MySQL connection configuration with promise support
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fyp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Use the correct function name UserRegisterController
UserRegisterController(app, db);
BookController(app, db);
ReserveController(app, db);
BookUpdate(app, db); 
bookSearch(app, db);


app.use('/',UserLoginController (db)); 


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Define routes
router.get('/stripe_config', async (req, res) => {
  try {
    const stripeConfig = {
      publicKey: sk_test_51P25nf2KndXIGYltKqFQJdT66Cp97SPUjtHfqms3qCImzGG8UfBZAjReM9STRTNK2F8p0YUwiec5hQRk8gDoqluw007g5p3zLy
    };
    res.json(stripeConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/create_checkout_session/:pk', async (req, res) => {
  try {
    const package = await knex('packages').where('id', req.params.pk).first();
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const domainUrl = 'http://localhost:3000/'; // Update with your domain
    const session = await stripe.checkout.sessions.create({
      success_url: `${domainUrl}success?session_id={CHECKOUT_SESSION_ID}&product_id=${req.params.pk}`,
      cancel_url: `${domainUrl}cancelled/`,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'NPR',
            product_data: {
              name: package.package_title
            },
            unit_amount: Math.round(package.package_price * 100)
          },
          quantity: 1
        }
      ]
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to process payment for book reservation
app.post('/payment', async (req, res) => {
  try {
    const { amount, currency, token, bookId, memberId } = req.body;

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method: ['card'],
      confirm: true,
    });

    // Handle the successful payment
    if (paymentIntent.status === 'succeeded') {
      // Update the reservation status in the database
      // You may want to use your existing logic here to update the reservation status

      // Return a success response
      res.status(200).json({ success: true, message: 'Payment successful' });
    } else {
      // Return an error response if payment fails
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Check Database Connection
// Connect to the database

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

