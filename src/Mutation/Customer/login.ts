import {stringArg} from 'nexus';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {ContextType} from '../../Types';

export const login = t => {
  return t.field('login', {
    type: 'CustomerAuthPayload',
    args: {
      email: stringArg(),
      password: stringArg(),
    },
    resolve: async (_, {email, password}, {user, prisma}: ContextType) => {
      const customer = await prisma.customer({email});

      if (!customer) throw new Error('Invalid Login');

      const isPasswordValid = await bcrypt.compare(password, customer.password);

      if (!isPasswordValid) throw new Error('Invalid Login');

      const token = jwt.sign(
        {id: customer.id, email: customer.email},
        process.env.AUTH_TOKEN_SECRET,
        {expiresIn: '30d'},
      );

      return {
        token,
        customer,
      };
    },
  });
};
