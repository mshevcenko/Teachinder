// eslint-disable-next-line max-classes-per-file
const { createTeacherInfoPopup } = require('./popups.js');

class TeacherContainer {
  constructor(teacher) {
    this.teacher = teacher;
    this.teacherCard = document.createElement('div');
    this.observers = [];
    this.init();
  }

  init() {
    this.teacherCard.classList.add('teacher_card');
    const teacherIcon = this.createTeacherIcon();
    this.teacherCard.insertAdjacentElement('afterbegin', teacherIcon);
    if (this.teacher.favorite) {
      this.teacherCard.classList.add('favorite_true');
    }
    this.teacherCard.insertAdjacentHTML('beforeend', '<img src="images/star.png" alt="favorite" class="favorite_teacher_mark">');
    this.teacherCard.insertAdjacentHTML('beforeend', this.teacher.full_name.split(/\s/).reduce((res, val) => `${res}<h2>${val}</h2>`, ''));
    this.teacherCard.insertAdjacentHTML('beforeend', `<p class="course">${this.teacher.course}</p>`);
    this.teacherCard.insertAdjacentHTML('beforeend', `<p class="country">${this.teacher.country}</p></div>`);
  }

  createTeacherIcon() {
    const teacherIcon = document.createElement('div');
    teacherIcon.classList.add('teacher_icon');
    if (this.teacher.picture_large) {
      teacherIcon.innerHTML = `<img src="${this.teacher.picture_large}" alt="${this.teacher.full_name}"/>`;
    } else {
      const initials = this.teacher.full_name.split(/\s/).reduce((res, val) => `${res}${val.charAt(0).toLocaleUpperCase()}.`, '');
      teacherIcon.innerHTML = `<h3>${initials}</h3>`;
    }
    teacherIcon.addEventListener('click', () => {
      createTeacherInfoPopup(this).showModal();
      document.body.classList.add('popup_active');
    });
    return teacherIcon;
  }

  getTeacherCard() {
    return this.teacherCard;
  }

  getTeacher() {
    return this.teacher;
  }

  setFavorite(favorite) {
    this.teacher.favorite = favorite;
    this.teacher.favorite
      ? this.teacherCard.classList.add('favorite_true')
      : this.teacherCard.classList.remove('favorite_true');
    this.observers.forEach((observer) => observer.notify(this));
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  setVisible(visibility) {
    console.log(visibility);
    visibility ? this.teacherCard.classList.remove('not_visible') : this.teacherCard.classList.add('not_visible');
  }
}

class TeacherList {
  constructor(teachers = []) {
    this.teachers = teachers;
    this.teacherContainers = [];
    this.teacherList = document.querySelector('.teacher_list');
    // eslint-disable-next-line no-use-before-define
    this.favoriteTeachers = new FavoriteTeachers(teachers);
    this.favoriteTeachers.addTopTeacherList(this);
    this.initTeacherContainers();
  }

  initTeacherContainers() {
    this.teacherContainers = [];
    for (const teacher of this.teachers) {
      const teacherContainer = new TeacherContainer(teacher);
      teacherContainer.addObserver(this);
      this.teacherContainers.push(teacherContainer);
    }
    this.show();
    this.filter();
  }

  notify(teacherContainer) {
    if (teacherContainer.getTeacher().favorite) {
      this.favoriteTeachers.addTeacher(teacherContainer.getTeacher());
    } else {
      this.favoriteTeachers.removeTeacher(teacherContainer.getTeacher());
    }
  }

  setFavorite(teacher) {
    for (const teacherContainer of this.teacherContainers) {
      if (teacherContainer.getTeacher() === teacher) {
        teacherContainer.teacher.favorite = teacher.favorite;
        teacherContainer.teacher.favorite
          ? teacherContainer.teacherCard.classList.add('favorite_true')
          : teacherContainer.teacherCard.classList.remove('favorite_true');
      }
    }
  }

  show() {
    const fragment = document.createDocumentFragment();
    for (const teacherContainer of this.teacherContainers) {
      fragment.appendChild(teacherContainer.getTeacherCard());
    }
    this.teacherList.innerHTML = '';
    this.teacherList.appendChild(fragment);
  }

  addTeacher(teacher) {
    const teacherContainer = new TeacherContainer(teacher);
    teacherContainer.addObserver(this);
    this.teacherContainers.push(teacherContainer);
    this.teacherList.appendChild(teacherContainer.getTeacherCard());
  }

  setTeachers(teachers) {
    this.teachers = teachers;
    this.initTeacherContainers();
  }

  filter() {
    const ageSelection = document.querySelector('.filter_teachers select[name=age_selection]');
    const ageRange = ageSelection.options[ageSelection.selectedIndex].value;
    const countrySelection = document.querySelector('.filter_teachers select[name=country_selection]');
    const country = countrySelection.options[countrySelection.selectedIndex].value;
    const genderSelection = document.querySelector('.filter_teachers select[name=sex_selection]');
    const gender = genderSelection.options[genderSelection.selectedIndex].value;
    const favorite = document.getElementById('favorites_checkbox').checked;
    const onlyWithPhoto = document.getElementById('only_with_photo_checkbox').checked;
    const floorAge = ageRange && parseInt(ageRange.split('-')[0], 10);
    const topAge = ageRange && parseInt(ageRange.split('-')[1], 10);
    this.teacherContainers.forEach((teacherContainer) => {
      const teacher = teacherContainer.getTeacher();
      if ((!floorAge || teacher.age >= floorAge)
        && (!topAge || teacher.age <= topAge)
        && (!country || teacher.country === country)
        && (!gender || teacher.gender === gender)
        && (!favorite || teacher.favorite === favorite)
        && (!onlyWithPhoto || teacher.picture_large)) {
        teacherContainer.setVisible(true);
      } else {
        teacherContainer.setVisible(false);
      }
    });
  }
}

class FavoriteTeachers {
  constructor(teachers) {
    this.teacherContainers = [];
    this.teacherList = document.querySelector('.favorites_teachers_list');
    this.firstVisible = 0;
    this.visibleCount = 5;
    for (const teacher of teachers) {
      if (teacher.favorite) {
        const teacherContainer = new TeacherContainer(teacher);
        teacherContainer.addObserver(this);
        this.teacherContainers.push(teacherContainer);
      }
    }
    this.updateVisibility();
    this.show();
  }

  updateVisibility() {
    if (this.firstVisible + this.visibleCount >= this.teacherContainers.length) {
      if (this.visibleCount <= this.teacherContainers.length) {
        this.firstVisible = this.teacherContainers.length - this.visibleCount;
      } else {
        this.firstVisible = 0;
      }
    }
    for (let i = 0; i < this.teacherContainers.length; i++) {
      if (i >= this.firstVisible && i < this.firstVisible + this.visibleCount) {
        this.teacherContainers[i].setVisible(true);
      } else {
        this.teacherContainers[i].setVisible(false);
      }
    }
  }

  addTopTeacherList(topTeachers) {
    this.topTeachers = topTeachers;
  }

  addTeacher(teacher) {
    const teacherContainer = new TeacherContainer(teacher);
    teacherContainer.addObserver(this);
    this.teacherContainers.push(teacherContainer);
    this.teacherList.appendChild(teacherContainer.getTeacherCard());
    this.updateVisibility();
  }

  addTeacherContainer(teacherContainer) {
    this.teacherContainers.push(teacherContainer);
    this.teacherList.appendChild(teacherContainer.getTeacherCard());
    this.updateVisibility();
  }

  removeTeacherContainer(teacherContainer) {
    for (let i = 0; i < this.teacherContainers.length; i++) {
      if (this.teacherContainers[i].getTeacher() === teacherContainer.getTeacher()) {
        this.teacherContainers[i].getTeacherCard().remove();
        this.teacherContainers.splice(i, 1);
        break;
      }
    }
    this.updateVisibility();
  }

  notify(teacherContainer) {
    if (teacherContainer.getTeacher().favorite) {
      this.addTeacherContainer(teacherContainer);
      console.log('add');
    } else {
      this.removeTeacherContainer(teacherContainer);
      console.log('remove');
    }
    console.log(this.teacherContainers.length);
    this.topTeachers.setFavorite(teacherContainer.getTeacher());
  }

  removeTeacher(teacher) {
    for (let i = 0; i < this.teacherContainers.length; i++) {
      if (this.teacherContainers[i].getTeacher() === teacher) {
        this.teacherContainers[i].getTeacherCard().remove();
        this.teacherContainers.splice(i, 1);
        break;
      }
    }
    this.updateVisibility();
  }

  show() {
    const fragment = document.createDocumentFragment();
    for (const teacherContainer of this.teacherContainers) {
      fragment.appendChild(teacherContainer.getTeacherCard());
    }
    this.teacherList.innerHTML = '';
    this.teacherList.appendChild(fragment);
  }

  showNext() {
    if (this.firstVisible + this.visibleCount < this.teacherContainers.length) {
      this.firstVisible++;
      this.updateVisibility();
    }
  }

  showPrevious() {
    if (this.firstVisible > 0) {
      this.firstVisible--;
      this.updateVisibility();
    }
  }
}

function initFavoriteArrowButtons(favoriteTeachers) {
  const leftArrow = document.getElementById('left_arrow');
  const rightArrow = document.getElementById('right_arrow');
  leftArrow.addEventListener('click', () => {
    if (favoriteTeachers.firstVisible > 0) {
      favoriteTeachers.showPrevious();
    }
  });
  rightArrow.addEventListener('click', () => {
    if (favoriteTeachers.firstVisible + favoriteTeachers.visibleCount < favoriteTeachers.teacherContainers.length) {
      favoriteTeachers.showNext();
    }
  });
}

module.exports = {
  initFavoriteArrowButtons,
  TeacherList,
};
