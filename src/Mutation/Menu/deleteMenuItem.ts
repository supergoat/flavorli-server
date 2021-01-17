import {idArg} from 'nexus';
import {ContextType} from '../../Types';

export const deleteMenuItem = t => {
  return t.field('deleteMenuItem', {
    type: 'MenuItem',
    args: {
      menuItemId: idArg(),
    },
    resolve: async (_, {menuItemId}, {user, prisma}: ContextType) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const menuItem = await prisma.deleteMenuItem({
        id: menuItemId,
      });

      return menuItem;
    },
  });
};
