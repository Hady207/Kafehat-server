const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URI,
  paypal: {
    publicKey: process.env.PAYPAL_PUBLIC_KEY,
    secretKey: process.env.PAYPAL_SECRET_KEY,
  },
  paypal: {
    publicKey: process.env.PAYPAL_PUBLIC_KEY,
    secretKey: process.env.PAYPAL_SECRET_KEY,
  },
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    sender: process.env.MAILCHIMP_SENDER,
  },
};
