// eslint-disable-next-line import/extensions,no-unused-vars
import { randomUserMock, additionalUsers } from './mock.js';

// 1. Format users

const courses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];
const defaultBackgroundColor = '#ffffff';
let nextUserId = 0;

function hasField(obj, ...args) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < args.length; i++) {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    // eslint-disable-next-line no-param-reassign
    obj = obj[args[i]];
  }
  return true;
}

function getField(obj, ...args) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < args.length; i++) {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return null;
    }
    // eslint-disable-next-line no-param-reassign
    obj = obj[args[i]];
  }
  return obj;
}

function formatUser(user) {
  const getUserField = (...args) => getField(user, ...args);
  let id = '';
  if (hasField(user, 'id', 'name')) {
    id = `${user.id.name || ''}${user.id.value || ''}`;
  } else {
    id = user.id;
  }
  const formattedUser = {
    // eslint-disable-next-line no-plusplus
    id: id || `NEW${nextUserId++}`,
    gender: getUserField('gender'),
    title: getUserField('title') || getUserField('name', 'title'),
    full_name: getUserField('full_name') || `${getUserField('name', 'first') || ''} ${getUserField('name', 'last') || ''}`,
    city: getUserField('city') || getUserField('location', 'city'),
    state: getUserField('state') || getUserField('location', 'state'),
    country: getUserField('country') || getUserField('location', 'country'),
    postcode: getUserField('postcode') || getUserField('location', 'postcode'),
    coordinates: getUserField('coordinates') || getUserField('location', 'coordinates'),
    timezone: getUserField('timezone') || getUserField('location', 'timezone'),
    email: getUserField('email'),
    b_date: getUserField('b_date') || getUserField('dob', 'date'),
    age: getUserField('age') || getUserField('dob', 'age'),
    phone: getUserField('phone'),
    picture_large: getUserField('picture_large') || getUserField('picture', 'large'),
    picture_thumbnail:
        getUserField('picture_thumbnail')
        || getUserField('picture', 'thumbnail')
        || getUserField('picture', 'medium')
        || getUserField('picture', 'large'),
    favorite: getUserField('favorite') || false,
    course: getUserField('course') || courses[Math.floor(Math.random() * courses.length)],
    bg_color: getUserField('bg_color') || defaultBackgroundColor,
    note: getUserField('note'),
  };
  return formattedUser;
}

function mergeUsers(randomUser, extraUser) {
  Object.keys(extraUser).forEach((key) => {
    if (extraUser[key] === null) {
      // eslint-disable-next-line no-param-reassign
      delete extraUser[key];
    }
  });
  Object.assign(randomUser, extraUser);
}

function formatUsers(randomUsers, extraUsers = []) {
  // eslint-disable-next-line no-param-reassign
  randomUsers = randomUsers.map(formatUser);
  // eslint-disable-next-line no-param-reassign
  extraUsers = extraUsers.map(formatUser);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < extraUsers.length; i++) {
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < randomUsers.length; j++) {
      if (extraUsers[i].id === randomUsers[j].id
          || extraUsers[i].phone === randomUsers[j].phone
          || extraUsers[i].email === randomUsers[j].email) {
        mergeUsers(randomUsers[j], extraUsers[i]);
        // eslint-disable-next-line no-param-reassign
        extraUsers[i] = null;
        break;
      }
    }
  }
  return [...randomUsers, ...extraUsers.filter(Boolean)];
}

// 2. Validation

function isNameValid(name) {
  return typeof name === 'string'
      && name.length > 0
      && name.charAt(0).toUpperCase() === name.charAt(0);
}

function isCountryValid(country) {
  return typeof country === 'string'
      && country.length > 0
      && country.charAt(0).toUpperCase() === country.charAt(0);
}

function isStateValid(state) {
  return typeof state === 'string'
      && state.length > 0
      && state.charAt(0).toUpperCase() === state.charAt(0);
}

function isCityValid(city) {
  return typeof city === 'string'
      && city.length > 0
      && city.charAt(0).toUpperCase() === city.charAt(0);
}

function isNoteValid(note) {
  return typeof note === 'string'
      && note.length > 0
      && note.charAt(0).toUpperCase() === note.charAt(0);
}

function isAgeValid(age) {
  return Number.isInteger(age) && age >= 18 && age <= 100;
}

function isPhoneValid(phone, country) {
  const uaPhoneRegex = /^(\+38\s?)?((\(0[1-9]{2}\))|(0[1-9]{2}))(\s|-)?[0-9]{3}(\s|-)?[0-9]{2}(\s|-)?[0-9]{2}$/g;
  const standardPhoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/g;
  if (country === 'Ukraine') return uaPhoneRegex.test(phone);
  return standardPhoneRegex.test(phone);
}

function isGenderValid(gender) {
  return gender === 'male' || gender === 'female';
}

function isEmailValid(email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailRegex.test(email);
}

function isUserValid(user) {
  return isNameValid(user.full_name)
      && isCountryValid(user.country)
      && isStateValid(user.state)
      && isCityValid(user.city)
      && isNoteValid(user.note)
      && isAgeValid(user.age)
      && isGenderValid(user.gender)
      && isEmailValid(user.email)
      && isPhoneValid(user.phone);
}

// 3. Filtration

function filterUsers(users, ageRange, country, gender, favorite) {
  const floorAge = ageRange && parseInt(ageRange.split('-')[0], 10);
  const topAge = ageRange && parseInt(ageRange.split('-')[1], 10);
  // eslint-disable-next-line no-mixed-operators
  return users.filter((user) => (!floorAge || user.age >= floorAge)
    && (!topAge || user.age <= topAge)
    && (!country || user.country === country)
    && (!gender || user.gender === gender)
    && (!favorite || user.favorite === favorite));
}

// 4. Sorting

function sortUsers(users, param, descending = false) {
  if (users.length < 2 || !(param in users[0])) return users;
  let compareFunc;
  if (param === 'age') {
    compareFunc = (first, second) => first.age - second.age;
  } else if (param === 'b_day') {
    compareFunc = (first, second) => Date.parse(first.b_day) - Date.parse(second.b_day);
  } else {
    compareFunc = (first, second) => first[param].localeCompare(second[param]);
  }
  users.sort(compareFunc);
  if (descending) users.reverse();
  return users;
}

// 5. Searching

function searchUsersByName(users, name) {
  return users.filter((user) => user.full_name && user.full_name.includes(name));
}

function searchUsersByAge(users, age) {
  return users.filter((user) => user.age && user.age === age);
}

function searchUsersByNote(users, note) {
  return users.filter((user) => user.note && user.note.includes(note));
}

function searchUsersBySearch(users, search) {
  if (!search) return users;
  let searchedUsers = searchUsersByName(users, search);
  if (searchedUsers.length > 0) return searchedUsers;
  searchedUsers = searchUsersByNote(users, search);
  if (searchedUsers.length > 0) return searchedUsers;
  searchedUsers = searchUsersByAge(users, parseInt(search, 10));
  if (searchedUsers.length > 0) return searchedUsers;
  return [];
}

function searchUsers(users, name, age, note) {
  // eslint-disable-next-line no-param-reassign
  users = (name && searchUsersByName(users, name)) || users;
  // eslint-disable-next-line no-param-reassign
  users = (age && searchUsersByAge(users, age)) || users;
  // eslint-disable-next-line no-param-reassign
  users = (note && searchUsersByNote(users, note)) || users;
  return users;
}

function searchUserBySearch(users, search) {
  const searchedUsers = searchUsersBySearch(users, search);
  if (searchedUsers.length > 0) return searchedUsers[0];
  return null;
}

function searchUser(users, name, age, note) {
  const searchedUsers = searchUsers(users, name, age, note);
  if (searchedUsers.length > 0) return searchedUsers[0];
  return null;
}

// 6. Search percent

function searchPercentBySearch(users, search) {
  // eslint-disable-next-line no-mixed-operators
  return searchUsersBySearch(users, search).length / users.length * 100.0;
}

function searchPercent(users, name, age, note) {
  // eslint-disable-next-line no-mixed-operators
  return searchUsers(users, name, age, note).length / users.length * 100.0;
}

export {
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
};
