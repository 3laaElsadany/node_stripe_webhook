const express = require('express');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.SECRET_KEY);
const port = process.env.PORT;


app.set('view engine', 'ejs');

app.post('/webhook', express.raw({
  type: 'application/json'
}), (req, res) => {
  const endpointSecret = `${process.env.STRIPE_WEBHOOK_SECRET}`;
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Subscription successful!', session.id);
      console.log(event.data);
      break;
    case 'invoice.paid':
      const invoice = event.data.object;
      console.log('Invoice paid!', invoice.id);
      break;
    case 'invoice.payment_failed':
      console.error.log('Invoice payment failed!');
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled!');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send()
});


app.get('/', (req, res, next) => {
  res.render('index');
})

app.post('/subscribe', async (req, res, next) => {
  let priceId;
  switch (req.query.plan) {
    case 'starter':
      priceId = process.env.STARTER_PRICE_ID;
      break;
    case 'pro':
      priceId = process.env.PRO_PRICE_ID;
      break;
    default:
      res.render('index');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  })

  res.redirect(session.url)
})


app.get('/success', async (req, res, next) => {
  const result = await Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id),
    stripe.checkout.sessions.listLineItems(req.query.session_id)
  ])
  console.log(JSON.stringify(result));
  res.render('success')
})

app.get('/cancel', (req, res, next) => {
  res.render('cancel')
})



app.get('/cancelSubscription/:subId', async (req, res, next) => {

  try {
    const subscriptionId = `${req.params.subId}`;
    const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);
    res.redirect('/cancel')
  } catch (error) {
    res.send('Invalid subscription ID')
  }

})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})