// eslint-disable-next-line import/extensions
import { randomUserMock, additionalUsers } from './mock.js';

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
  randomUsers = randomUsers.map(formatUser);
  extraUsers = extraUsers.map(formatUser);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < extraUsers.length; i++) {
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

function isNameValid(user) {
  return typeof user.full_name === 'string'
      && user.full_name.length > 0
      && user.full_name.charAt(0).toUpperCase() === user.full_name.charAt(0);
}

function isCountryValid(user) {
  return typeof user.country === 'string'
      && user.country.length > 0
      && user.country.charAt(0).toUpperCase() === user.country.charAt(0);
}

function isStateValid(user) {
  return typeof user.state === 'string'
      && user.state.length > 0
      && user.state.charAt(0).toUpperCase() === user.state.charAt(0);
}

function isCityValid(user) {
  return typeof user.city === 'string'
      && user.city.length > 0
      && user.city.charAt(0).toUpperCase() === user.city.charAt(0);
}

function isNoteValid(user) {
  return typeof user.note === 'string'
      && user.note.length > 0
      && user.note.charAt(0).toUpperCase() === user.note.charAt(0);
}

function isAgeValid(user) {
  return Number.isInteger(user.age) && user.age >= 18 && user.age <= 100;
}

function isPhoneValid(user) {
  const uaPhoneRegex = /^(\+38\s?)?((\(0[1-9]{2}\))|(0[1-9]{2}))(\s|\-)?[0-9]{3}(\s|\-)?[0-9]{2}(\s|\-)?[0-9]{2}$/g;
  const standardPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;
  if (user.country === 'Ukraine') return uaPhoneRegex.test(user.phone);
  return standardPhoneRegex.test(user.phone);
}

function isGenderValid(user) {
  return user.gender === 'male' || user.gender === 'female';
}

function isEmailValid(user) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailRegex.test(user.email);
}

function isUserValid(user) {
  return isNameValid(user)
      && isCountryValid(user)
      && isStateValid(user)
      && isCityValid(user)
      && isNoteValid(user)
      && isAgeValid(user)
      && isGenderValid(user)
      && isEmailValid(user)
      && isPhoneValid(user);
}

// 3. Filtration

function filterUsers(users, ageRange, country, gender, favorite) {
  const floorAge = parseInt(ageRange.split('-')[0], 10);
  const topAge = parseInt(ageRange.split('-')[1], 10);
  return users.filter((user) => user.age >= floorAge
    && user.age <= topAge
    && user.country === country
    && user.gender === gender
    && user.favorite === favorite);
}

const formattedUsers = formatUsers(randomUserMock, additionalUsers);
// console.log(formattedUsers.length);
// console.log(formattedUsers);
const obj = {
  email: 'emai.l1@gmail.com',
  full_name: 'مهدیس',
  age: 29,
  gender: 'female',
  state: 'State',
  country: 'Ukraine',
  city: 'City',
  note: 'Note',
  phone: '+380685334502',
};
// console.log(isUserValid(obj));
console.log(filterUsers(formattedUsers, '55-75', 'Germany', 'male', true));
