import {prismaObjectType} from 'nexus-prisma';
import orderMutations from './Order';
import restaurantMutations from './Restaurant';
import menuMutations from './Menu';
import customerMutations from './Customer';

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    restaurantMutations(t);
    menuMutations(t);
    customerMutations(t);
    orderMutations(t);
  },
});

export default Mutation;
