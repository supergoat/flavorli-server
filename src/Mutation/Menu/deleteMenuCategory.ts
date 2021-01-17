import {idArg} from 'nexus';
import {ContextType} from '../../Types';

export const deleteMenuCategory = t => {
  return t.field('deleteMenuCategory', {
    type: 'MenuCategory',
    args: {
      categoryId: idArg(),
    },
    resolve: async (_, {categoryId}, ctx) => {
      if (!ctx.user) {
        throw new Error('Not Authenticated');
      }

      const menuCategory = await ctx.prisma.deleteMenuCategory({
        id: categoryId,
      });

      return menuCategory;
    },
  });
};
