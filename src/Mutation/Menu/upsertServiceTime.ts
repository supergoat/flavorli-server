import {stringArg, idArg} from 'nexus';
import {ContextType} from '../../Types';

export const upsertServiceTime = t => {
  return t.field('upsertServiceTime', {
    type: 'ServiceTime',
    args: {
      id: idArg({
        required: false,
      }),
      menuId: idArg(),
      hours: stringArg({
        list: true,
      }),
      days: stringArg({
        list: true,
      }),
    },
    resolve: async (
      _,
      {id, menuId, hours, days},
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const data = {
        hours: {set: hours},
        days: {set: days},
        menu: {
          connect: {
            id: menuId,
          },
        },
      };

      if (id) {
        return await prisma.updateServiceTime({
          where: {id},
          data,
        });
      } else {
        return await prisma.createServiceTime(data);
      }
    },
  });
};
