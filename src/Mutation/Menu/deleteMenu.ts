import {idArg} from 'nexus';
import {ContextType} from '../../Types';

export const deleteMenu = t => {
  return t.field('deleteMenu', {
    type: 'Menu',
    args: {
      menuId: idArg(),
    },
    resolve: async (_, {menuId}, ctx) => {
      if (!ctx.user) {
        throw new Error('Not Authenticated');
      }

      const menu = await ctx.prisma.deleteMenu({
        id: menuId,
      });

      return menu;
    },
  });
};
