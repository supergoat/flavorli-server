import {prismaObjectType} from 'nexus-prisma';
import {idArg} from 'nexus';
import {
  getRestaurant,
  getMenu,
  getCategory,
  getMenuItem,
  getOptions,
} from './Restaurant';
import {getOrder, getOrders, getOrderHistory} from './Order';
import {getCustomerOrder} from './Customer';

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    getCustomerOrder(t);
    getOrder(t);
    getOrders(t);
    getOrderHistory(t);
    getRestaurant(t);
    getMenu(t);
    getCategory(t);
    getMenuItem(t);
    getOptions(t);
    t.prismaFields([
      'customer',
      'order',
      'customers',
      'restaurants',
      'menuItem',
      'restaurant',
    ]);
    t.field('me', {
      type: 'Customer',
      resolve: async (_, _args, {user, prisma}: {user: any; prisma: any}) => {
        if (!user) {
          throw new Error('Not Authenticated');
        }

        return await prisma.customer({email: user.email});
      },
    });
    t.list.field('userOrders', {
      type: 'Order',
      resolve: (_, _args: any, {user, prisma}: any) =>
        prisma.orders({
          where: {customer: {id: user.id}},
          orderBy: 'createdAt_DESC',
        }),
    });
  },
});

export default Query;
