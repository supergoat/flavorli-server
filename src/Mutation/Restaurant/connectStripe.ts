import {stringArg} from 'nexus';
import fetch from 'node-fetch';
import {ContextType} from '../../Types';

export const connectStripe = t => {
  return t.field('connectStripe', {
    type: 'Restaurant',
    args: {
      code: stringArg(),
      state: stringArg(),
    },
    resolve: async (_, {code, state}, {user, prisma}: ContextType) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      if (state !== process.env.CHECKOUT_SESSION_STATE_KEY)
        throw new Error('Access Denied');

      const res: any = await fetch('https://connect.stripe.com/oauth/token', {
        body: `client_secret=${
          process.env.STRIPE_SECRET_KEY
        }&code=${code}&grant_type=authorization_code`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      });

      const {
        access_token,
        refresh_token,
        stripe_publishable_key,
        stripe_user_id,
        error,
      } = await res.json();

      if (error) throw new Error('Authorization unsuccessful');

      const updatedRestaurant = await prisma.updateRestaurant({
        where: {
          id: user.id,
        },
        data: {
          access_token,
          refresh_token,
          stripe_publishable_key,
          stripe_user_id,
          isConnected: true,
        },
      });

      return updatedRestaurant;
    },
  });
};
