import {idArg} from 'nexus';

import {subscriptionField} from 'nexus';
import {Prisma} from '../../generated/prisma-client';

export const getOrderStatus = subscriptionField('getOrderStatus', {
  type: 'Order',
  args: {
    orderId: idArg(),
  },
  subscribe: (
    _root,
    {orderId},
    {user, prisma}: {user: any; prisma: Prisma},
  ) => {
    if (!user) {
      throw new Error('Not Authenticated');
    }

    return prisma.$subscribe
      .order({
        mutation_in: ['UPDATED'],
        node: {
          customer: {
            id: user.id,
          },
          id: orderId,
        },
      })
      .node();
  },
  resolve: t => t,
});
