import {idArg} from 'nexus';
import {ContextType} from '../../Types';

export const deleteServiceTime = t => {
  return t.field('deleteServiceTime', {
    type: 'ServiceTime',
    args: {
      id: idArg(),
    },
    resolve: async (_, {id}, {user, prisma}: ContextType) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const serviceTime = await prisma.deleteServiceTime({id});

      return serviceTime;
    },
  });
};
