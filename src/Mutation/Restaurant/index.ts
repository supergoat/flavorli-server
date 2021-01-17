import {registerRestaurant} from './registerRestaurant';
import {loginRestaurant} from './loginRestaurant';
import {connectStripe} from './connectStripe';
import {updateRestaurant} from './updateRestaurant';
import {upsertOpeningTime} from './upsertOpeningTime';
import {deleteOpeningTime} from './deleteOpeningTime';

const restaurantMutations = t => {
  registerRestaurant(t);
  loginRestaurant(t);
  connectStripe(t);
  updateRestaurant(t);
  upsertOpeningTime(t);
  deleteOpeningTime(t);
};

export default restaurantMutations;
