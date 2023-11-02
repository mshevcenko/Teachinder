let { nextUserId } = require('./process.js');
const { isUserValid } = require('./process.js');
const { post } = require('./database.js');

function initPopups() {
  const popups = document.getElementsByClassName('popup');
  for (const popup of popups) {
    popup.addEventListener('click', (e) => {
      const dialogDimensions = popup.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left
        || e.clientX > dialogDimensions.right
        || e.clientY < dialogDimensions.top
        || e.clientY > dialogDimensions.bottom
      ) {
        popup.close();
        document.body.classList.remove('popup_active');
      }
    });
    const popupCloseButtons = popup.getElementsByClassName('popup_close_btn');
    for (const popupCloseButton of popupCloseButtons) {
      popupCloseButton.addEventListener('click', () => {
        popup.close();
        document.body.classList.remove('popup_active');
      });
    }
  }
}

function createTeacherInfoPopup(teacherContainer) {
  const teacher = teacherContainer.getTeacher();
  const teacherCard = teacherContainer.getTeacherCard();
  const teacherInfoPopup = document.getElementById('teacher_info_popup');
  for (const teacherPhoto of teacherInfoPopup.getElementsByClassName('teacher_photo')) {
    teacherPhoto.setAttribute('src', teacher.picture_large || 'images/teacher_icon.jpg');
    teacherPhoto.setAttribute('alt', teacher.full_name);
  }
  for (const teacherFullName of teacherInfoPopup.getElementsByClassName('fullname')) {
    teacherFullName.innerHTML = teacher.full_name;
  }
  for (const favoriteMark of teacherInfoPopup.getElementsByClassName('favorite_mark')) {
    favoriteMark.innerHTML = teacher.favorite ? '<img src="images/star.png" alt="favorite mark"/>' : '<img src="images/star_border.png" alt="favorite mark"/>';
    favoriteMark.onclick = () => {
      teacherContainer.setFavorite(!teacher.favorite);
      favoriteMark.innerHTML = teacher.favorite ? '<img src="images/star.png" alt="favorite mark"/>' : '<img src="images/star_border.png" alt="favorite mark"/>';
    };
  }
  for (const course of teacherInfoPopup.getElementsByClassName('subject')) {
    course.innerHTML = teacher.course;
  }
  for (const cityAndCountry of teacherInfoPopup.getElementsByClassName('city_and_country')) {
    cityAndCountry.innerHTML = `${teacher.city}, ${teacher.country}`;
  }
  for (const ageAndSex of teacherInfoPopup.getElementsByClassName('age_and_sex')) {
    ageAndSex.innerHTML = `${teacher.age}, ${teacher.gender}`;
  }
  for (const email of teacherInfoPopup.getElementsByClassName('email')) {
    email.setAttribute('href', teacher.email);
    email.innerHTML = teacher.email;
  }
  for (const phoneNumber of teacherInfoPopup.getElementsByClassName('phone_number')) {
    phoneNumber.innerHTML = teacher.phone;
  }
  for (const note of teacherInfoPopup.getElementsByClassName('about_teacher')) {
    note.innerHTML = teacher.note;
  }
  return teacherInfoPopup;
}

function getAge(birthdate) {
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear()
    - (today.getMonth() < birthdate.getMonth()
      || (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
  return age;
}

function initSubmitForm(teachersList) {
  const addTeacherPopup = document.getElementById('add_teacher_popup');
  const form = document.querySelector('#add_teacher_popup form');
  form.onsubmit = (event) => {
    event.preventDefault();
    const name = document.getElementById('name_textbox').value;
    const subjectSelection = document.getElementById('subject_selection');
    const subject = subjectSelection.options[subjectSelection.selectedIndex].value;
    const countrySelection = document.getElementById('country_selection');
    const country = countrySelection.options[countrySelection.selectedIndex].value;
    const city = document.getElementById('city_textbox').value;
    const email = document.getElementById('email_textbox').value;
    const phone = document.getElementById('phone_textbox').value;
    const dateOfBirth = document.getElementById('date_of_birth_picker').value;
    const sex = document.querySelector('input[name="sex"]:checked').value;
    const backgroundColor = document.getElementById('background_color_picker').value;
    const note = document.getElementById('notes_text_area').value;
    const ageOld = dateOfBirth ? getAge(new Date(dateOfBirth)) : 0;
    const teacher = {
      id: `NEW${nextUserId++}`,
      gender: `${sex}`,
      title: '',
      full_name: `${name}`,
      city: `${city}`,
      state: `${city}`,
      country: `${country}`,
      postcode: '',
      coordinates: '',
      timezone: '',
      email: `${email}`,
      b_date: `${dateOfBirth}`,
      age: ageOld,
      phone: `${phone}`,
      picture_large: '',
      picture_thumbnail: '',
      favorite: false,
      course: `${subject}`,
      bg_color: `${backgroundColor}`,
      note: `${note}`,
    };
    if (isUserValid(teacher)) {
      teachersList.addTeacher(teacher);
      post(teacher);
      addTeacherPopup.close();
      document.body.classList.remove('popup_active');
    } else {
      alert('Teacher is not valid!');
    }
  };
}

function createAddTeacherPopup() {
  const addTeacherPopup = document.getElementById('add_teacher_popup');
  addTeacherPopup.querySelector('form').reset();
  return addTeacherPopup;
}

function initAddTeacherButtons() {
  for (const addTeacherBtn of document.querySelectorAll('nav button')) {
    addTeacherBtn.onclick = () => {
      createAddTeacherPopup().showModal();
      document.body.classList.add('popup_active');
    };
  }
}

const countries = [
  'Germany',
  'Ireland',
  'Australia',
  'United States',
  'Finland',
  'Turkey',
  'Switzerland',
  'New Zealand',
  'Spain',
  'Norway',
  'Denmark',
  'Iran',
  'Canada',
  'France',
  'Spain',
  'Norway',
  'Denmark',
  'Canada',
  'France',
  'Netherlands',
  'Ukraine',
];

function initAddTeacherCountries() {
  let html = `<option value="${countries[0]}" selected>${countries[0]}</option>`;
  for (let i = 1; i < countries.length; i++) {
    html += `<option value="${countries[i]}">${countries[i]}</option>`;
  }
  document.querySelector('#country_selection').innerHTML = html;
}

const courses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];

function initAddTeacherCourses() {
  let html = `<option value="${courses[0]}" selected>${courses[0]}</option>`;
  for (let i = 1; i < courses.length; i++) {
    html += `<option value="${courses[i]}">${courses[i]}</option>`;
  }
  document.querySelector('#subject_selection').innerHTML = html;
}

module.exports = {
  initPopups,
  createTeacherInfoPopup,
  initSubmitForm,
  createAddTeacherPopup,
  initAddTeacherButtons,
  initAddTeacherCountries,
  initAddTeacherCourses,
};
