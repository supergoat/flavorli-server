import {stringArg, idArg} from 'nexus';
import {ContextType} from '../../Types';

export const updateMenu = t => {
  return t.field('updateMenu', {
    type: 'Menu',
    args: {
      menuId: idArg(),
      name: stringArg({
        required: false,
      }),
      description: stringArg({
        required: false,
      }),
    },
    resolve: async (
      _,
      {menuId, name, description},
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      let data: any = {};

      if (name !== undefined) data.name = name;
      if (description !== undefined) data.description = description;

      const menu = await prisma.updateMenu({
        where: {id: menuId},
        data,
      });

      return menu;
    },
  });
};
