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

function formatUsers(randomUsers, extraUsers) {
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

const formattedUsers = formatUsers(randomUserMock, additionalUsers);
console.log(formattedUsers.length);
console.log(formattedUsers);
