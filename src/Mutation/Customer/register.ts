import {stringArg} from 'nexus';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {ContextType} from '../../Types';

export const register = t => {
  return t.field('register', {
    type: 'CustomerAuthPayload',
    args: {
      email: stringArg(),
      password: stringArg(),
      name: stringArg(),
      tel: stringArg(),
    },
    resolve: async (
      _,
      {email, password, name, tel},
      {user, prisma}: ContextType,
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const customer = await prisma.createCustomer({
        name,
        email,
        tel,
        password: hashedPassword,
      });

      const token = jwt.sign(
        {
          id: customer.id,
          email: customer.email,
        },
        process.env.AUTH_TOKEN_SECRET,
        {
          expiresIn: '30d', // token will expire in 30days
        },
      );

      return {
        token,
        customer,
      };
    },
  });
};
