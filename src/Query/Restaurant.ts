import {Prisma} from '../../generated/prisma-client';
import {arg, idArg} from 'nexus/dist';

export const getRestaurant = t => {
  return t.field('getRestaurant', {
    type: 'Restaurant',
    resolve: async (_, _args, {user, prisma}: {user: any; prisma: Prisma}) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      return await prisma.restaurant({id: user.id});
    },
  });
};

export const getMenu = t => {
  return t.field('getMenu', {
    type: 'Menu',
    args: {
      menuId: idArg(),
    },
    resolve: async (
      _,
      {menuId},
      {user, prisma}: {user: any; prisma: Prisma},
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const menu = await prisma.menu({
        id: menuId,
      });

      return menu;
    },
  });
};

export const getCategory = t => {
  return t.field('getCategory', {
    type: 'MenuCategory',
    args: {
      categoryId: idArg(),
    },
    resolve: async (
      _,
      {categoryId},
      {user, prisma}: {user: any; prisma: Prisma},
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const category = await prisma.menuCategory({
        id: categoryId,
      });

      return category;
    },
  });
};

export const getMenuItem = t => {
  return t.field('getMenuItem', {
    type: 'MenuItem',
    args: {
      menuItemId: idArg(),
    },
    resolve: async (
      _,
      {menuItemId},
      {user, prisma}: {user: any; prisma: Prisma},
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const menuItem = await prisma.menuItem({
        id: menuItemId,
      });

      return menuItem;
    },
  });
};

export const getOptions = t => {
  return t.list.field('getOptions', {
    type: 'Option',
    args: {
      menuItemId: arg({
        type: 'ID',
        required: false,
      }),
    },
    resolve: async (
      _,
      {menuItemId},
      {user, prisma}: {user: any; prisma: Prisma},
    ) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      let where: any = {
        restaurant: {id: user.id},
      };

      if (menuItemId) {
        where.menuItems_none = {
          id: menuItemId,
        };
      }

      const options = await prisma.options({
        where: {
          AND: [where],
        },
      });

      return options;
    },
  });
};
