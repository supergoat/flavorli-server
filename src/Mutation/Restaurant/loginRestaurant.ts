import {stringArg} from 'nexus';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {ContextType} from '../../Types';

export const loginRestaurant = t => {
  return t.field('loginRestaurant', {
    type: 'RestaurantAuthPayload',
    args: {
      email: stringArg(),
      password: stringArg(),
    },
    resolve: async (_, {email, password}, {prisma}: ContextType) => {
      const restaurant = await prisma.restaurant({email});

      if (!restaurant) {
        throw new Error('Invalid Login');
      }

      const passwordMatch = await bcrypt.compare(password, restaurant.password);

      if (!passwordMatch) throw new Error('Invalid Login');

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
