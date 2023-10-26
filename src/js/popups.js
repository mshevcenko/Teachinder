let { nextUserId } = require('./process.js');
const { isUserValid } = require('./process.js');

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
      console.log(teacher.favorite);
      teacherContainer.setFavorite(!teacher.favorite);
      console.log(teacher.favorite);
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

function initSubmitForm(teachers, teachersList) {
  const addTeacherPopup = document.getElementById('add_teacher_popup');
  const form = document.querySelector('#add_teacher_popup form');
  console.log(form);
  form.onsubmit = (event) => {
    event.preventDefault();
    console.log('submit');
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
    console.log(Date.parse(dateOfBirth));
    const ageOld = dateOfBirth ? getAge(new Date(dateOfBirth)) : 0;
    console.log(ageOld);
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
    console.log(teacher);
    if (isUserValid(teacher)) {
      teachers.push(teacher);
      teachersList.addTeacher(teacher);
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

module.exports = {
  initPopups,
  createTeacherInfoPopup,
  initSubmitForm,
  createAddTeacherPopup,
  initAddTeacherButtons,
};
