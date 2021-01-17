import {stringArg, idArg, arg, booleanArg} from 'nexus';
import {ContextType} from '../../Types';

export const upsertMenuItem = t => {
  return t.field('upsertMenuItem', {
    type: 'MenuItem',
    args: {
      categoryId: idArg(),
      id: idArg({
        required: false,
      }),
      name: stringArg({
        required: false,
      }),
      image: stringArg({
        required: false,
      }),
      price: stringArg({
        required: false,
      }),
      description: stringArg({
        required: false,
      }),
      dietary: stringArg({
        required: false,
        list: true,
      }),
      options: arg({
        type: 'ID',
        list: true,
        required: false,
      }),
      available: booleanArg({
        required: false,
      }),
    },
    resolve: async (
      _,
      {
        id,
        name,
        image,
        categoryId,
        price,
        available,
        description,
        dietary,
        options,
      },
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const data: any = {
        category: {
          connect: {
            id: categoryId,
          },
        },
      };

      if (name !== undefined) data.name = name;
      if (image !== undefined) data.image = image;
      if (description !== undefined) data.description = description;
      if (price !== undefined) data.price = price;

      if (available !== undefined) data.available = available;

      if (dietary) {
        data.dietary = {
          set: dietary,
        };
      }

      if (id) {
        data.options = {
          set: options.map(option => ({id: option})),
        };
      }

      if (!id) {
        data.options = {
          connect: options.map(option => ({id: option})),
        };
      }

      if (id) {
        return await prisma.updateMenuItem({
          where: {id},
          data,
        });
      } else {
        return await prisma.createMenuItem(data);
      }
    },
  });
};
