import {addMenu} from './addMenu';
import {deleteMenu} from './deleteMenu';
import {updateMenu} from './updateMenu';
import {upsertServiceTime} from './upsertServiceTime';
import {deleteServiceTime} from './deleteServiceTime';
import {addMenuCategory} from './addMenuCategory';
import {updateMenuCategory} from './updateMenuCategory';
import {deleteMenuCategory} from './deleteMenuCategory';
import {upsertMenuItem} from './upsertMenuItem';
import {deleteMenuItem} from './deleteMenuItem';
import {createMenuItemOption} from './createMenuItemOption';
import {addMenuItemOption} from './addMenuItemOption';

const menuMutations = t => {
  addMenu(t);
  deleteMenu(t);
  updateMenu(t);
  upsertServiceTime(t);
  deleteServiceTime(t);
  addMenuCategory(t);
  updateMenuCategory(t);
  deleteMenuCategory(t);
  upsertMenuItem(t);
  deleteMenuItem(t);
  createMenuItemOption(t);
  addMenuItemOption(t);
};

export default menuMutations;
