import {login} from './login';
import {register} from './register';

const customerMutations = t => {
  login(t);
  register(t);
};

export default customerMutations;
