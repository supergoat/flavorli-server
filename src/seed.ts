// mutation {
//   registerAdmin(email: "biff@biffskitchen.com", name: "Biff Burrows", password: "1234", tel: "07717 174971") {
//     token
//     user {
//       id
//       name
//     }
//   }
// }

// mutation {
//   createRestaurant(name: "Biff's Jack Shack",
//   adminId: "cjumsmj3d000y07074na2yxos"
//   tel: "07717 174971",
//   address: {
//     number: "Unit 49, Boxpark Shoreditch",
//     streetName: "2-10 Bethnal Green Rd",
//     city:"London",
//     postalCode: "E1 6GY"
//   }) {
//     id
//     name
//   }
// }

// mutation {
//   addMenu(name:"All Day", restaurantId: "cjumsnzj9001d0707xfdi5lbe") {
//     id
//     name
//     restaurant {
//       id
//     }
//     categories {
//       name
//     }
//   }
// }

// mutation {
// 	addMenuCategory(name: "Burgers", menuId: "cjumst1zt001n0707gh1amuxe") {
//     id
//     name
//   }
// }

// mutation{
// 	addMenuItem(
//     name: "The Big Jack",
//     categoryId: "cjumt5ibj00310707y42k3elk",
//     price:8.00
//   ) {
//     id
//     name
//     category {
//       id
//     }
//     price
//   }
// }

// mutation {
//   addMenuItemOption(
//     name: "Add Filthy Fries"
//     min: 0
//     max: 1
//     items: [{ name: "Bang Bang", price: 2.00 }]
//     menuItemId: "cjun2gq5d003r0707msdjb338"
//   ) {
//     id
//     name
//     items {
//       name
//       price
//     }
//   }
// }
