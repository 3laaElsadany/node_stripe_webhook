
# Node Stripe Webhook

A simple project using Node.js and Express to handle Stripe Webhooks.

## Requirements

- Node.js (v14 or higher)
- Stripe account
- Stripe CLI (optional for local testing)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/3laaElsadany/node_stripe_webhook.git
   cd node_stripe_webhook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   SECRET_KEY=your_stripe_secret_key
   PORT=3000
   STARTER_PRICE_ID=price_......
   PRO_PRICE_ID=price_........
   BASE_URL=http://localhost:3000
   STRIPE_WEBHOOK_SECRET=whsec_........
   ```

   - You can get the `SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` and `STARTER_PRICE_ID` and `PRO_PRICE_ID` from your Stripe Dashboard.

## Project Structure

```plaintext
node_stripe_webhook/
├── index.js           # Main file to run the server and handle webhooks
├── package.json       # Project metadata and dependencies
├── .env               # Environment variables (not included in repo)
└── views/             # View templates (if any)
```

## Running the server

To start the server:

```bash
npm start
```

The server will listen on the port specified in the `.env` file (default is 3000).

## Testing Webhooks using Stripe CLI

1. Install Stripe CLI if you don't have it:
   ```bash
   npm install -g stripe
   ```

2. Run the following command to listen for webhook events:
   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```

3. Trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

You should see a response from the server confirming that the event was received.
