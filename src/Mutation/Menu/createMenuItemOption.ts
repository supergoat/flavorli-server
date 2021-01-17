import {stringArg, idArg, arg} from 'nexus';
import {ContextType} from '../../Types';

export const createMenuItemOption = t => {
  return t.field('createMenuItemOption', {
    type: 'Option',
    args: {
      id: idArg({
        required: false,
      }),
      name: stringArg(),
      min: stringArg(),
      max: stringArg(),
      items: arg({
        type: 'OptionItemWhereInput',
        list: true,
        required: true,
      }),
    },
    resolve: async (
      _,
      {id, name, min, max, items},
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const data: any = {
        name,
        min,
        max,
        items: {
          set: [],
        },
        restaurant: {
          connect: {
            id: user.id,
          },
        },
      };

      await prisma.deleteManyOptionItems({option: {id}});

      if (items.length > 0) {
        data.items = {
          create: items.map(item => {
            if (!item.name || !item.price)
              throw new Error(
                'Field items must be an array of type Item = {name: String, price: String}',
              );
            return {name: item.name, price: item.price};
          }),
        };
      }

      if (id) {
        return await prisma.updateOption({
          where: {id},
          data,
        });
      } else {
        return await prisma.createOption(data);
      }
    },
  });
};
