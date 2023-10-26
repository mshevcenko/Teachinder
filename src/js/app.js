// eslint-disable-next-line max-classes-per-file
const testModules = require('./test-module');
const { randomUserMock, additionalUsers } = require('./mock.js');
const { formatUsers } = require('./process.js');
const { initPopups, initSubmitForm, initAddTeacherButtons } = require('./popups.js');
const { updateStatistics, initStatisticsButtons } = require('./statistics.js');
const { initFilterCountries, initFiltration } = require('./filtration.js');
const { TeacherList, initFavoriteArrowButtons } = require('./teacher.js');
const { initSearch } = require('./search.js');
// require('../css/app.css');

/** ******** Your code here! *********** */

/* function createHtmlTeacher(teacher) {
  let teacherHtml = '<div class="teacher_card">';
  const name = teacher.full_name.split(/\s/);
  if (teacher.picture_large) {
    teacherHtml += `<div class="teacher_icon"><img src="${teacher.picture_large}" alt="${teacher.full_name}"/></div>`;
  } else {
    const initials = name.reduce((res, val) => `${res}${val.charAt(0).toLocaleUpperCase()}.`, '');
    teacherHtml += `<div class="teacher_icon"><h3>${initials}</h3></div>`;
  }
  if (teacher.favorite) {
    teacherHtml += '<img src="images/star.png" alt="favorite" class="favorite_teacher_mark">';
  }
  teacherHtml += name.reduce((res, val) => `${res}<h2>${val}</h2>`, '');
  teacherHtml += `<p class="course">${teacher.course}</p>`;
  teacherHtml += `<p class="country">${teacher.country}</p></div>`;
  return teacherHtml;
}

function addTeachersToDOM(teachers) {
  const teacherLists = document.getElementsByClassName('teacher_list');
  const teachersHtml = teachers.reduce((res, val) => `${res}${createHtmlTeacher(val)}`, '');
  const fragment = document.createDocumentFragment();
  // eslint-disable-next-line no-restricted-syntax
  for (const teacher of teachers) {
    // eslint-disable-next-line no-use-before-define
    fragment.appendChild(createTeacherCard(teacher));
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const teacherList of teacherLists) {
    teacherList.innerHTML = '';
    teacherList.appendChild(fragment);
  }
} */

/* function createTeacherIcon(teacher) {
  const teacherIcon = document.createElement('div');
  teacherIcon.classList.add('teacher_icon');
  if (teacher.picture_large) {
    teacherIcon.innerHTML = `<img src="${teacher.picture_large}" alt="${teacher.full_name}"/>`;
  } else {
    const initials = teacher.full_name.split(/\s/).reduce((res, val) => `${res}${val.charAt(0).toLocaleUpperCase()}.`, '');
    teacherIcon.innerHTML = `<h3>${initials}</h3>`;
  }
  return teacherIcon;
}

function createTeacherCard(teacher) {
  const teacherCard = document.createElement('div');
  teacherCard.classList.add('teacher_card');
  const teacherIcon = createTeacherIcon(teacher);
  teacherIcon.addEventListener('click', () => {
    createTeacherInfoPopup(teacher, teacherCard).showModal();
    document.body.classList.add('popup_active');
  });
  teacherCard.insertAdjacentElement('afterbegin', teacherIcon);
  if (teacher.favorite) {
    teacherCard.classList.add('favorite_true');
  }
  teacherCard.insertAdjacentHTML('beforeend', '<img src="images/star.png" alt="favorite" class="favorite_teacher_mark">');
  teacherCard.insertAdjacentHTML('beforeend', teacher.full_name.split(/\s/).reduce((res, val) => `${res}<h2>${val}</h2>`, ''));
  teacherCard.insertAdjacentHTML('beforeend', `<p class="course">${teacher.course}</p>`);
  teacherCard.insertAdjacentHTML('beforeend', `<p class="country">${teacher.country}</p></div>`);
  return teacherCard;
} */

const formattedTeachers = formatUsers(randomUserMock, additionalUsers);
const teacherList = new TeacherList(formattedTeachers);
initPopups();
updateStatistics(formattedTeachers);
initStatisticsButtons(formattedTeachers);
initFilterCountries();
initFiltration(teacherList);
initSubmitForm(formattedTeachers, teacherList);
initFavoriteArrowButtons(teacherList.favoriteTeachers);
initAddTeacherButtons();
initSearch(formattedTeachers, teacherList);
