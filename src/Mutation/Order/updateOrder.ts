import {stringArg, idArg, intArg} from 'nexus';
import {ContextType} from '../../Types';

export const updateOrder = t => {
  return t.field('updateOrder', {
    type: 'Order',
    args: {
      orderId: idArg(),
      status: stringArg({
        required: false,
      }),
      priceAdjustment: stringArg({
        required: false,
      }),
      delayedBy: intArg({
        required: false,
      }),
      cancelReason: stringArg({
        required: false,
      }),
      priceAdjustmentReason: stringArg({
        required: false,
      }),
    },
    resolve: async (
      _,
      {
        orderId,
        status,
        priceAdjustment,
        delayedBy,
        cancelReason,
        priceAdjustmentReason,
      },
      {user, prisma, stripe}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      let data: any = {};

      if (status !== undefined) data.status = status;
      if (priceAdjustment !== undefined) data.priceAdjustment = priceAdjustment;
      if (delayedBy !== undefined) data.delayedBy = delayedBy;
      if (cancelReason !== undefined) data.cancelReason = cancelReason;
      if (priceAdjustmentReason !== undefined)
        data.priceAdjustmentReason = priceAdjustmentReason;

      const order = await prisma.updateOrder({
        where: {id: orderId},
        data,
      });

      if (status === 'Declined' || status === 'Cancelled') {
        const order = await prisma.order({id: orderId});
        const restaurant = await prisma.order({id: orderId}).restaurant();

        const intent = await stripe.paymentIntents.retrieve(
          order.paymentIntentId,
          {
            stripe_account: restaurant.stripe_user_id,
          },
        );

        const refund = await stripe.refunds.create(
          {
            charge: intent.charges.data[0].id,
          },
          {
            stripe_account: restaurant.stripe_user_id,
          },
        );
      }

      return order;
    },
  });
};
