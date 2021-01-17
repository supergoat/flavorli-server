import {upsertOrder} from './upsertOrder';
import {updateOrder} from './updateOrder';

const orderMutations = t => {
  upsertOrder(t);
  updateOrder(t);
};

export default orderMutations;
