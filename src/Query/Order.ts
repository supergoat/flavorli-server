import {Prisma} from '../../generated/prisma-client';
import {idArg, stringArg} from 'nexus/dist';
import {isOpenTime} from '../_utils/isOpenTime';

export const getOrder = t => {
  return t.field('getOrder', {
    type: 'Order',
    args: {
      id: idArg(),
    },
    resolve: async (_, {id}, {user, prisma}: {user: any; prisma: Prisma}) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const order = await prisma.order({id});

      return order;
    },
  });
};

export const getOrders = t => {
  return t.field('getOrders', {
    type: 'Order',
    list: true,
    resolve: async (_, _args, {user, prisma}: {user: any; prisma: Prisma}) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const openingTimes = await prisma
        .restaurant({
          id: user.id,
        })
        .openingTimes();

      let isRestaurantOpen = false;

      const dateNow = new Date();
      let weekday = new Array();
      weekday[0] = 'Sunday';
      weekday[1] = 'Monday';
      weekday[2] = 'Tuesday';
      weekday[3] = 'Wednesday';
      weekday[4] = 'Thursday';
      weekday[5] = 'Friday';
      weekday[6] = 'Saturday';

      const today = weekday[dateNow.getUTCDay()];
      let opensAt = '00:00';
      let closesAt = '24:00';

      openingTimes.forEach((openingTime: any) => {
        if (
          openingTime.days.includes(today) &&
          isOpenTime(openingTime.hours[0], openingTime.hours[1])
        ) {
          isRestaurantOpen = true;
          if (openingTime.hours[0] > opensAt) opensAt = openingTime.hours[0];
        }
      });

      if (!isRestaurantOpen) return [];

      const opensAtDate = new Date();
      opensAtDate.setHours(Number(opensAt.split(':')[0]));
      opensAtDate.setMinutes(Number(opensAt.split(':')[1]));

      const orders = await prisma.orders({
        where: {
          restaurant: {
            id: user.id,
          },
          OR: [{status: 'Pending'}, {status: 'InProgress'}, {status: 'Ready'}],
          createdAt_gte: opensAtDate,
        },
        orderBy: 'dueAt_ASC',
      });

      return orders;
    },
  });
};

export const getOrderHistory = t => {
  return t.field('getOrderHistory', {
    type: 'Order',
    list: true,
    resolve: async (_, _args, {user, prisma}: {user: any; prisma: Prisma}) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const orders = await prisma.orders({
        where: {
          restaurant: {
            id: user.id,
          },
        },
        orderBy: 'createdAt_ASC',
      });

      return orders;
    },
  });
};
