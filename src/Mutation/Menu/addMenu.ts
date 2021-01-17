import {stringArg} from 'nexus';
import {ContextType} from '../../Types';

export const addMenu = t => {
  return t.field('addMenu', {
    type: 'Menu',
    args: {
      name: stringArg(),
    },
    resolve: async (_, {name}, {user, prisma}: ContextType) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const menu = await prisma.createMenu({
        name,
        restaurant: {
          connect: {
            id: user.id,
          },
        },
      });

      return menu;
    },
  });
};
