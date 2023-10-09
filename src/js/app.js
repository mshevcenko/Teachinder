const testModules = require('./test-module');
const { randomUserMock, additionalUsers } = require('./mock.js');
// require('../css/app.css');

/** ******** Your code here! *********** */

// 1. Format users

const courses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];
const defaultBackgroundColor = '#ffffff';
let nextUserId = 0;

function hasField(obj, ...args) {
  for (let i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

function getField(obj, ...args) {
  for (let i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return null;
    }
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
      delete extraUser[key];
    }
  });
  Object.assign(randomUser, extraUser);
}

function formatUsers(randomUsers, extraUsers = []) {
  randomUsers = randomUsers.map(formatUser);
  extraUsers = extraUsers.map(formatUser);
  for (let i = 0; i < extraUsers.length; i++) {
    for (let j = 0; j < randomUsers.length; j++) {
      if (extraUsers[i].id === randomUsers[j].id
        || extraUsers[i].phone === randomUsers[j].phone
        || extraUsers[i].email === randomUsers[j].email) {
        mergeUsers(randomUsers[j], extraUsers[i]);
        extraUsers[i] = null;
        break;
      }
    }
  }
  return [...randomUsers, ...extraUsers.filter(Boolean)];
}

// 2. Validation

function isFirstLetterUppercase(str) {
  return typeof str === 'string'
    && str.length > 0
    && str.charAt(0).toLocaleUpperCase() === str.charAt(0);
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
  return isFirstLetterUppercase(user.full_name)
    && isFirstLetterUppercase(user.country)
    && isFirstLetterUppercase(user.state)
    && isFirstLetterUppercase(user.city)
    && isFirstLetterUppercase(user.note)
    && isAgeValid(user.age)
    && isGenderValid(user.gender)
    && isEmailValid(user.email)
    && isPhoneValid(user.phone);
}

// 3. Filtration

function filterUsers(users, ageRange, country, gender, favorite) {
  const floorAge = ageRange && parseInt(ageRange.split('-')[0], 10);
  const topAge = ageRange && parseInt(ageRange.split('-')[1], 10);
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
  } else if (param === 'country' || param === 'full_name') {
    compareFunc = (first, second) => first[param].localeCompare(second[param]);
  } else {
    return users;
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

function searchUsersByQuery(users, query) {
  if (!query) return users;
  let searchedUsers = searchUsersByName(users, query);
  if (searchedUsers.length > 0) return searchedUsers;
  searchedUsers = searchUsersByNote(users, query);
  if (searchedUsers.length > 0) return searchedUsers;
  searchedUsers = searchUsersByAge(users, parseInt(query, 10));
  if (searchedUsers.length > 0) return searchedUsers;
  return [];
}

function searchUsers(users, name, age, note) {
  users = (name && searchUsersByName(users, name)) || users;
  users = (age && searchUsersByAge(users, age)) || users;
  users = (note && searchUsersByNote(users, note)) || users;
  return users;
}

function searchUserByQuery(users, query) {
  const searchedUsers = searchUsersByQuery(users, query);
  if (searchedUsers.length > 0) return searchedUsers[0];
  return null;
}

function searchUser(users, name, age, note) {
  const searchedUsers = searchUsers(users, name, age, note);
  if (searchedUsers.length > 0) return searchedUsers[0];
  return null;
}

// 6. Search percent

function searchPercentByQuery(users, query) {
  return searchUsersByQuery(users, query).length / users.length * 100.0;
}

function searchPercent(users, name, age, note) {
  return searchUsers(users, name, age, note).length / users.length * 100.0;
}

module.exports = {
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
};
