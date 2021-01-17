import {prisma} from './generated/prisma-client';
import {GraphQLServer} from 'graphql-yoga';
import * as jwt from 'jsonwebtoken';
import schema from './src/schema';
import * as Stripe from 'stripe';

require('dotenv').config();

const stripe: any = new Stripe(process.env.STRIPE_SECRET_KEY);

const isTokenValid = token => {
  try {
    if (token) {
      return jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
};

const server = new GraphQLServer({
  schema,
  context: ({request, connection}) => {
    if (connection) {
      const tokenWithBearer = connection.context.authorization || '';
      const token = tokenWithBearer.split(' ')[1];
      const user = isTokenValid(token);

      return {
        user,
        prisma,
        stripe,
      };
    } else {
      const tokenWithBearer = request.headers.authorization || '';
      const token = tokenWithBearer.split(' ')[1];
      const user = isTokenValid(token);

      return {user, prisma, stripe};
    }
  },
});

const bodyParser = require('body-parser');

server.express.post(
  '/api/stripe/payment-webhook/succeeded',
  bodyParser.raw({type: 'application/json'}),
  (request, response) => {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_SUCCEEDED;

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // Fulfill the purchase...
      hadlePaymentSucceeded(paymentIntent);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
  },
);

server.express.post(
  '/api/stripe/payment-webhook/failed',
  bodyParser.raw({type: 'application/json'}),
  (request, response) => {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_FAILED;

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      hadlePaymentFailed(paymentIntent);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
  },
);

const hadlePaymentSucceeded = async (paymentIntent: any) => {
  const customer = await prisma
    .order({id: paymentIntent.metadata.orderId})
    .customer();

  await prisma.updateOrder({
    where: {
      id: paymentIntent.metadata.orderId,
    },
    data: {
      status: 'Pending',
      paymentIntentId: paymentIntent.id,
    },
  });
};

const hadlePaymentFailed = async (paymentIntent: any) => {
  const customer = await prisma
    .order({id: paymentIntent.metadata.orderId})
    .customer();

  await prisma.updateOrder({
    where: {
      id: paymentIntent.metadata.orderId,
    },
    data: {
      status: 'Failed',
      paymentIntentId: paymentIntent.id,
    },
  });
};

server.start(() => console.log('Server is running on http://localhost:4000'));
