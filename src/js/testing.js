const {
  formatUsers,
  isUserValid,
  filterUsers,
  sortUsers,
  searchUsers,
  searchUser,
  searchUsersByQuery,
  searchUserByQuery,
  searchPercent,
  searchPercentByQuery,
} = require('./app.js');
const { randomUserMock, additionalUsers } = require('./mock.js');

const formattedUsers = formatUsers(randomUserMock, additionalUsers);
const testUser = {
  full_name: 'Mykhailo Shevchenko',
  country: 'Ukraine',
  state: 'State',
  city: 'City',
  gender: 'male',
  age: 19,
  phone: '+380685333333',
  email: 'example@gmail.com',
  note: 'Smth',
};

console.log('===================================================================');
console.log('1. Formatting');
console.log('===================================================================');
console.log();
console.log(formattedUsers);
console.log();
console.log('===================================================================');
console.log('2. Validation');
console.log('===================================================================');
console.log();
console.log(testUser);
console.log(isUserValid(testUser));
console.log(formattedUsers[1]);
console.log(isUserValid(formattedUsers[1]));
console.log();
console.log('===================================================================');
console.log('3. Filtration');
console.log('===================================================================');
console.log();
console.log(filterUsers(formattedUsers, '55-75', 'Germany', 'male', true));
console.log();
console.log('===================================================================');
console.log('4. Sorting');
console.log('===================================================================');
console.log();
console.log(sortUsers(formattedUsers, 'full_name'));
console.log();
console.log('===================================================================');
console.log('5. Searching');
console.log('===================================================================');
console.log();
console.log(searchUsers(formattedUsers, 'r', 65, null));
console.log(searchUsersByQuery(formattedUsers, '65'));
console.log(searchUser(formattedUsers, 'r', 65, null));
console.log(searchUserByQuery(formattedUsers, '65'));
console.log();
console.log('===================================================================');
console.log('6. Search percent');
console.log('===================================================================');
console.log();
console.log('percent:', searchPercent(formattedUsers, 'r', 65, null));
console.log('percent:', searchPercentByQuery(formattedUsers, '65'));
