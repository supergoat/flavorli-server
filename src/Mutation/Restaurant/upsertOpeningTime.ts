import {stringArg, idArg} from 'nexus';
import {ContextType} from '../../Types';

export const upsertOpeningTime = t => {
  return t.field('upsertOpeningTime', {
    type: 'OpeningTime',
    args: {
      id: idArg({
        required: false,
      }),
      hours: stringArg({
        list: true,
      }),
      days: stringArg({
        list: true,
      }),
    },
    resolve: async (_, {id, hours, days}, {user, prisma}: ContextType) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const data = {
        hours: {set: hours},
        days: {set: days},
        restaurant: {
          connect: {
            id: user.id,
          },
        },
      };

      if (id) {
        return await prisma.updateOpeningTime({
          where: {id},
          data,
        });
      } else {
        return await prisma.createOpeningTime(data);
      }
    },
  });
};
