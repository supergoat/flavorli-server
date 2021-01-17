import {stringArg, idArg, arg} from 'nexus';
import {ContextType} from '../../Types';

export const upsertOrder = t => {
  return t.field('upsertOrder', {
    type: 'StripeCheckoutSession',
    args: {
      orderId: idArg({
        required: false,
      }),
      paymentMethod: arg({
        type: 'PaymentMethodInput',
        required: false,
      }),
      restaurantId: idArg(),
      total: stringArg(),
      orderItems: arg({
        type: 'OrderItemInput',
        list: true,
        required: true,
      }),
    },
    resolve: async (
      _,
      {orderId = '0', paymentMethod, restaurantId, total, orderItems},
      {user, prisma, stripe}: ContextType,
    ) => {
      const restaurant = await prisma.restaurant({id: restaurantId});
      let customer = await prisma.customer({id: user.id});

      const APPLICATION_FEE_PERCENTAGE_CUT = 0.1;
      const totalInCents = Number(total) * 100;

      if (!customer.customerStripeId) {
        const stripeCustomer = await stripe.customers.create(
          {
            email: user.email,
            payment_method: paymentMethod.payment_method_id,
          },
          {stripe_account: restaurant.stripe_user_id},
        );

        customer.customerStripeId = stripeCustomer.id;
      }

      const doesPaymentMethodExistOnCustomer = await prisma.$exists.paymentMethod(
        {
          payment_method_id: paymentMethod.payment_method_id,
        },
      );

      if (!doesPaymentMethodExistOnCustomer) {
        const customerPaymentMethod = await prisma.createPaymentMethod(
          paymentMethod,
        );
        // Attach paymentMethod to customer
        await stripe.paymentMethods.attach(
          paymentMethod.payment_method_id,
          {
            customer: customer.customerStripeId,
          },
          {stripe_account: restaurant.stripe_user_id},
        );

        try {
          // Delete previous payment method if any
          await prisma.updateCustomer({
            where: {id: user.id},
            data: {paymentMethod: {delete: true}},
          });
        } catch (e) {
          console.log('No payment method attached to this customer');
        }

        await prisma.updateCustomer({
          where: {id: user.id},
          data: {
            paymentMethod: {connect: {id: customerPaymentMethod.id}},
            customerStripeId: customer.customerStripeId,
          },
        });
      }

      const paymentIntent = await stripe.paymentIntents.create(
        {
          customer: customer.customerStripeId,
          payment_method: paymentMethod.payment_method_id,
          amount: totalInCents,
          currency: 'gbp',
          application_fee_amount: totalInCents * APPLICATION_FEE_PERCENTAGE_CUT,
        },
        {stripe_account: restaurant.stripe_user_id},
      );

      const order = await prisma.upsertOrder({
        update: {
          status: 'requires_payment',
        },
        where: {
          id: orderId,
        },
        create: {
          orderNo: 1,
          total,
          dueAt: new Date().toISOString(),
          status: 'requires_payment',
          items: {
            create: orderItems.map((orderItem: any) => ({
              name: orderItem.name,
              price: orderItem.price,
              quantity: orderItem.quantity,
              image: orderItem.image,
              options: {
                create: (orderItem.options || []).map((option: any) => ({
                  name: option.name,
                  items: {create: option.items},
                })),
              },
            })),
          },
          restaurant: {connect: {id: restaurantId}},
          customer: {connect: {id: user.id}},
        },
      });

      await stripe.paymentIntents.update(
        paymentIntent.id,
        {metadata: {orderId: order.id}},
        {stripe_account: restaurant.stripe_user_id},
      );

      return {
        order,
        stripe_user_id: restaurant.stripe_user_id,
        client_secret: paymentIntent.client_secret,
      };
    },
  });
};
