import {idArg} from 'nexus';
import {ContextType} from '../../Types';

export const addMenuItemOption = t => {
  return t.field('addMenuItemOption', {
    type: 'Option',
    args: {
      optionId: idArg(),
      menuItemId: idArg(),
    },
    resolve: async (_, {optionId, menuItemId}, {user, prisma}: ContextType) => {
      if (!user) throw new Error('Not Authenticated');

      const menuItemOption = await prisma.updateMenuItem({
        where: {id: menuItemId},
        data: {options: {connect: {id: optionId}}},
      });

      return menuItemOption;
    },
  });
};
