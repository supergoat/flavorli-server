import {Prisma} from '../../generated/prisma-client';

export type ContextType = {
  user: any;
  prisma: Prisma;
  stripe: any;
};
