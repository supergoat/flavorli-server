import {prisma} from '../generated/prisma-client';
import {objectType, inputObjectType} from 'nexus';
import datamodelInfo from '../generated/nexus-prisma';
import * as path from 'path';
import {prismaObjectType, makePrismaSchema} from 'nexus-prisma';
import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';

const OrderItemOptionItemInput = inputObjectType({
  name: 'OrderItemOptionItemInput',
  definition(t) {
    t.string('name');
    t.string('price');
  },
});

const OrderItemOptionInput = inputObjectType({
  name: 'OrderItemOptionInput',
  definition(t) {
    t.string('name');
    t.field('items', {
      type: 'OrderItemOptionItemInput',
      list: true,
    });
  },
});

const OrderItemInput = inputObjectType({
  name: 'OrderItemInput',
  definition(t) {
    t.string('name');
    t.string('price');
    t.string('image');
    t.int('quantity');
    t.field('options', {
      type: 'OrderItemOptionInput',
      list: true,
    });
  },
});

const PaymentMethodInput = inputObjectType({
  name: 'PaymentMethodInput',
  definition(t) {
    t.string('payment_method_id');
    t.string('last4');
    t.string('brand');
  },
});

const RestaurantAuthPayload = objectType({
  name: 'RestaurantAuthPayload',
  definition(t) {
    t.string('token');
    t.field('restaurant', {
      type: 'Restaurant',
    });
  },
});

const CustomerAuthPayload = objectType({
  name: 'CustomerAuthPayload',
  definition(t) {
    t.string('token');
    t.field('customer', {
      type: 'Customer',
    });
  },
});

const Customer = prismaObjectType({
  name: 'Customer',
  definition(t) {
    t.prismaFields({filter: ['password']});
  },
});

const Restaurant = prismaObjectType({
  name: 'Restaurant',
  definition(t) {
    t.prismaFields({
      filter: [
        'password',
        'access_token',
        'refresh_token',
        'stripe_publishable_key',
        'stripe_user_id',
      ],
    });
  },
});

const StripeCheckoutSession = objectType({
  name: 'StripeCheckoutSession',
  definition(t) {
    t.string('stripe_user_id');
    t.string('client_secret');
    t.field('order', {
      type: 'Order',
    });
  },
});

const schema = makePrismaSchema({
  types: [
    Query,
    Mutation,
    ...Subscription,
    Customer,
    Restaurant,
    StripeCheckoutSession,
    RestaurantAuthPayload,
    CustomerAuthPayload,
    PaymentMethodInput,
    OrderItemInput,
    OrderItemOptionInput,
    OrderItemOptionItemInput,
  ],

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
});

export default schema;
