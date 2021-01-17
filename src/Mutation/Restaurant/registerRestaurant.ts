import {stringArg, arg} from 'nexus';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {ContextType} from '../../Types';

export const registerRestaurant = t => {
  return t.field('registerRestaurant', {
    type: 'RestaurantAuthPayload',
    args: {
      name: stringArg(),
      email: stringArg(),
      password: stringArg(),
      tel: stringArg(),
      address: arg({
        type: 'AddressWhereInput',
      }),
    },
    resolve: async (
      _,
      {name, email, password, tel, address},
      {user, prisma}: ContextType,
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const restaurant = await prisma.createRestaurant({
        name,
        email,
        password: hashedPassword,
        tel,
        address: {
          create: {
            ...address,
          },
        },
      });

      const token = jwt.sign(
        {
          id: restaurant.id,
          email: restaurant.email,
        },
        process.env.AUTH_TOKEN_SECRET,
        {expiresIn: '30d'},
      );

      return {
        token,
        restaurant,
      };
    },
  });
};
