import {stringArg, idArg, booleanArg} from 'nexus';
import {ContextType} from '../../Types';

export const updateMenuCategory = t => {
  return t.field('updateMenuCategory', {
    type: 'MenuCategory',
    args: {
      categoryId: idArg(),
      name: stringArg({
        required: false,
      }),
      description: stringArg({
        required: false,
      }),
      available: booleanArg({
        required: false,
      }),
    },
    resolve: async (
      _,
      {categoryId, name, description, available},
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      let data: any = {};

      if (name) data.name = name;
      if (description) data.description = description;
      if (available !== undefined) data.available = available;

      const menuCategory = await prisma.updateMenuCategory({
        where: {id: categoryId},
        data,
      });

      return menuCategory;
    },
  });
};
