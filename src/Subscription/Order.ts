import {subscriptionField} from 'nexus';
import {Prisma} from '../../generated/prisma-client';

export const getRestaurantOrders = subscriptionField('getRestaurantOrders', {
  type: 'Order',
  subscribe: (_root, _args, {user, prisma}: {user: any; prisma: Prisma}) => {
    if (!user) {
      throw new Error('Not Authenticated');
    }

    return prisma.$subscribe
      .order({
        mutation_in: ['UPDATED'],
        node: {
          restaurant: {
            id: user.id,
          },
          status: 'Pending',
        },
      })
      .node();
  },
  resolve: t => t,
});
