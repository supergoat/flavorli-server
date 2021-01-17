import {stringArg, arg} from 'nexus';
import {ContextType} from '../../Types';

export const updateRestaurant = t => {
  return t.field('updateRestaurant', {
    type: 'Restaurant',
    args: {
      name: stringArg({
        required: false,
      }),
      email: stringArg({
        required: false,
      }),
      status: stringArg({
        required: false,
      }),
      image: stringArg({
        required: false,
      }),
      logo: stringArg({
        required: false,
      }),
      description: stringArg({
        required: false,
      }),
      averagePreparationTime: stringArg({
        required: false,
      }),
      averageBusyPreparationTime: stringArg({
        required: false,
      }),
      tel: stringArg({
        required: false,
      }),
      address: arg({
        type: 'AddressWhereInput',
        required: false,
      }),
    },
    resolve: async (
      _,
      {
        name,
        email,
        status,
        image,
        logo,
        description,
        averagePreparationTime,
        averageBusyPreparationTime,
        tel,
        address,
      },
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const data: any = {};

      if (name !== undefined) data.name = name;
      if (email !== undefined) data.email = email;
      if (status !== undefined) data.status = status;
      if (image !== undefined) data.image = image;
      if (logo !== undefined) data.logo = logo;
      if (description !== undefined) data.description = description;
      if (averagePreparationTime !== undefined)
        data.averagePreparationTime = averagePreparationTime;
      if (averageBusyPreparationTime !== undefined)
        data.averageBusyPreparationTime = averageBusyPreparationTime;
      if (tel !== undefined) data.tel = tel;

      if (address !== undefined) {
        data.address = {
          update: {
            ...address,
          },
        };
      }

      const updatedRestaurant = await prisma.updateRestaurant({
        where: {
          id: user.id,
        },
        data,
      });

      return updatedRestaurant;
    },
  });
};
