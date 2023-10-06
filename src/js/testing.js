import {
  formatUsers,
  isUserValid,
  filterUsers,
  sortUsers,
  searchUsers,
  searchUser,
  searchUsersBySearch,
  searchUserBySearch,
  searchPercent,
  searchPercentBySearch,
// eslint-disable-next-line import/extensions
} from './main.js';
import { randomUserMock, additionalUsers } from './mock.js';

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

console.log(formattedUsers);
console.log('=========================================================================================');
console.log(isUserValid(testUser));
console.log('=========================================================================================');
console.log(filterUsers(formattedUsers, '55-75', 'Germany', 'male', true));
console.log('=========================================================================================');
console.log(sortUsers(formattedUsers, 'full_name'));
console.log('=========================================================================================');
console.log(searchUsers(formattedUsers, 'r', 65, null));
console.log('=========================================================================================');
console.log(searchUsersBySearch(formattedUsers, '65'));
console.log('=========================================================================================');
console.log(searchUser(formattedUsers, 'r', 65, null));
console.log('=========================================================================================');
console.log(searchUserBySearch(formattedUsers, '65'));
console.log('=========================================================================================');
console.log('percent:', searchPercent(formattedUsers, 'r', 65, null));
console.log('=========================================================================================');
console.log('percent:', searchPercentBySearch(formattedUsers, '65'));
