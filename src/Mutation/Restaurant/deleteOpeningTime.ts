import {stringArg, idArg} from 'nexus';
import {ContextType} from '../../Types';

export const deleteOpeningTime = t => {
  return t.field('deleteOpeningTime', {
    type: 'OpeningTime',
    args: {
      id: idArg(),
    },
    resolve: async (_, {id}, {user, prisma}: ContextType) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const openingTime = await prisma.deleteOpeningTime({id});

      return openingTime;
    },
  });
};
