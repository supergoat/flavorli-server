import {stringArg, idArg} from 'nexus';
import {ContextType} from '../../Types';

export const addMenuCategory = t => {
  return t.field('addMenuCategory', {
    type: 'MenuCategory',
    args: {
      name: stringArg(),
      menuId: idArg(),
    },
    resolve: async (_, {name, menuId}, ctx) => {
      if (!ctx.user) {
        throw new Error('Not Authenticated');
      }

      const menuCategory = await ctx.prisma.createMenuCategory({
        name,
        menu: {
          connect: {
            id: menuId,
          },
        },
      });

      return menuCategory;
    },
  });
};
