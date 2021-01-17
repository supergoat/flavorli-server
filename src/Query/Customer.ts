import {Prisma} from '../../generated/prisma-client';
import {idArg, stringArg} from 'nexus/dist';
import {isOpenTime} from '../_utils/isOpenTime';

export const getCustomerOrder = t => {
  return t.field('getCustomerOrder', {
    type: 'Order',
    args: {
      orderId: idArg(),
    },
    resolve: async (
      _,
      {orderId},
      {user, prisma}: {user: any; prisma: Prisma},
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const order = await prisma.order({id: orderId});

      return order;
    },
  });
};
