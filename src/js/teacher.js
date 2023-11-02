// eslint-disable-next-line max-classes-per-file
const { createTeacherInfoPopup } = require('./popups.js');
const { getTeachers } = require('./api.js');
const { Statistics } = require('./statistics.js');

class TeacherContainer {
  constructor(teacher, teacherList) {
    this.teacher = teacher;
    this.teacherCard = document.createElement('div');
    this.favoriteTeacherCard = document.createElement('div');
    this.favoriteTeachersList = document.querySelector('.favorites_teachers_list');
    this.visibility = true;
    this.teacherList = teacherList;
    this.init();
  }

  init() {
    this.initCard(this.teacherCard);
    this.initCard(this.favoriteTeacherCard);
  }

  initCard(card) {
    card.classList.add('teacher_card');
    const teacherIcon = this.createTeacherIcon();
    card.insertAdjacentElement('afterbegin', teacherIcon);
    if (this.teacher.favorite) {
      card.classList.add('favorite_true');
    }
    card.insertAdjacentHTML('beforeend', '<img src="images/star.png" alt="favorite" class="favorite_teacher_mark">');
    card.insertAdjacentHTML('beforeend', this.teacher.full_name.split(/\s/).reduce((res, val) => `${res}<h2>${val}</h2>`, ''));
    card.insertAdjacentHTML('beforeend', `<p class="course">${this.teacher.course}</p>`);
    card.insertAdjacentHTML('beforeend', `<p class="country">${this.teacher.country}</p></div>`);
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

  getTeacher() {
    return this.teacher;
  }

  getTeacherCard() {
    return this.teacherCard;
  }

  getFavoriteTeacherCard() {
    return this.favoriteTeacherCard;
  }

  setFavorite(favorite) {
    if (this.teacher.favorite === favorite) {
      return;
    }
    this.teacher.favorite = favorite;
    if (this.teacher.favorite) {
      this.teacherCard.classList.add('favorite_true');
      this.teacherList.addFavoriteTeacherContainer(this);
    } else {
      this.teacherCard.classList.remove('favorite_true');
      this.teacherList.removeFavoriteTeacherContainer(this);
    }
  }

  setVisible(visibility) {
    this.visibility = visibility;
    visibility ? this.teacherCard.classList.remove('not_visible') : this.teacherCard.classList.add('not_visible');
  }

  setFavoriteVisible(visibility) {
    visibility ? this.favoriteTeacherCard.classList.remove('not_visible') : this.favoriteTeacherCard.classList.add('not_visible');
  }
}

class TeacherList {
  constructor(teachers = []) {
    this.teachers = teachers;
    this.teacherContainers = [];
    this.favoriteTeacherContainers = [];
    this.teacherList = document.querySelector('.teacher_list');
    this.favoriteTeachersList = document.querySelector('.favorites_teachers_list');
    this.firstFavoriteVisible = 0;
    this.favoriteVisibleCount = 5;
    this.moreButton = document.querySelector('.more_btn button');
    this.filtered = false;
    this.searched = false;
    this.accessibleTeacherContainers = [];
    this.query = '';
    this.statistics = new Statistics(teachers);
    this.initTeacherContainers();
    this.initMoreButton();
  }

  initTeacherContainers() {
    this.teacherContainers = [];
    for (const teacher of this.teachers) {
      const teacherContainer = new TeacherContainer(teacher, this);
      this.teacherContainers.push(teacherContainer);
      if (teacher.favorite) {
        this.favoriteTeacherContainers.push(teacherContainer);
      }
    }
    this.accessibleTeacherContainers = this.teacherContainers;
    this.show();
    this.search(this.query);
  }

  initMoreButton() {
    const teacherList = this;
    this.moreButton.onclick = async function () {
      const teachers = await getTeachers(10);
      teacherList.addTeachers(teachers);
    };
  }

  /* setFavorite(teacher) {
    for (const teacherContainer of this.teacherContainers) {
      if (teacherContainer.getTeacher() === teacher) {
        teacherContainer.teacher.favorite = teacher.favorite;
        teacherContainer.teacher.favorite
          ? teacherContainer.teacherCard.classList.add('favorite_true')
          : teacherContainer.teacherCard.classList.remove('favorite_true');
      }
    }
  } */

  show() {
    this.showAllTeachers();
    this.showFavoriteTeachers();
  }

  showAllTeachers() {
    const fragment = document.createDocumentFragment();
    for (const teacherContainer of this.teacherContainers) {
      fragment.appendChild(teacherContainer.getTeacherCard());
    }
    this.teacherList.innerHTML = '';
    this.teacherList.appendChild(fragment);
  }

  showFavoriteTeachers() {
    const fragment = document.createDocumentFragment();
    for (const teacherContainer of this.favoriteTeacherContainers) {
      fragment.appendChild(teacherContainer.getFavoriteTeacherCard());
    }
    this.favoriteTeachersList.innerHTML = '';
    this.favoriteTeachersList.appendChild(fragment);
  }

  addTeacher(teacher) {
    const teacherContainer = new TeacherContainer(teacher, this);
    this.teachers.push(teacher);
    this.teacherContainers.push(teacherContainer);
    this.teacherList.appendChild(teacherContainer.getTeacherCard());
    if (teacher.favorite) {
      this.favoriteTeachersList.appendChild(teacherContainer.getFavoriteTeacherCard());
    }
    const statisticsPage = this.statistics.currentPage;
    this.search(this.query);
    this.statistics.showPage(statisticsPage);
  }

  addTeachers(teachers) {
    const fragment = document.createDocumentFragment();
    for (const teacher of teachers) {
      const teacherContainer = new TeacherContainer(teacher, this);
      this.teachers.push(teacher);
      this.teacherContainers.push(teacherContainer);
      if (teacher.favorite) {
        this.favoriteTeachersList.appendChild(teacherContainer.getFavoriteTeacherCard());
      }
      fragment.appendChild(teacherContainer.getTeacherCard());
    }
    this.teacherList.appendChild(fragment);
    const statisticsPage = this.statistics.currentPage;
    this.search(this.query);
    this.statistics.showPage(statisticsPage);
  }

  setTeachers(teachers) {
    this.teachers = teachers;
    this.initTeacherContainers();
  }

  update() {
    if (this.filtered || this.searched) {
      this.moreButton.classList.add('not_visible');
    } else {
      this.moreButton.classList.remove('not_visible');
    }
    this.updateStatistics();
  }

  updateStatistics(page = 1) {
    const visibleTeachers = [];
    for (const teacherContainer of this.teacherContainers) {
      if (teacherContainer.visibility) {
        visibleTeachers.push(teacherContainer.getTeacher());
      }
    }
    this.statistics.update(visibleTeachers, page);
  }

  filter() {
    this.filterTeachers(this.accessibleTeacherContainers);
  }

  filterTeachers(teachers) {
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
    teachers.forEach((teacherContainer) => {
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
    this.filtered = floorAge || topAge || country || gender || favorite || onlyWithPhoto;
    this.update();
  }

  searchTeachersByName(name) {
    return this.teacherContainers.filter((teacher) => teacher.getTeacher().full_name && teacher.getTeacher().full_name.toLocaleLowerCase().includes(name));
  }

  searchTeachersByAge(age) {
    return this.teacherContainers.filter((teacher) => teacher.getTeacher().age && teacher.getTeacher().age === age);
  }

  searchTeachersByNote(note) {
    return this.teacherContainers.filter((teacher) => teacher.getTeacher().note && teacher.getTeacher().note.toLocaleLowerCase().includes(note));
  }

  search(query) {
    this.query = query;
    query = query.toLocaleLowerCase();
    if (!query) {
      this.searched = false;
      this.accessibleTeacherContainers = this.teacherContainers;
      this.filter();
      return;
    }
    this.searched = true;
    this.setVisible(this.teacherContainers, false);
    this.accessibleTeacherContainers = this.searchTeachersByName(query);
    if (this.accessibleTeacherContainers.length > 0) {
      this.filter();
      return;
    }
    this.accessibleTeacherContainers = this.searchTeachersByNote(query);
    if (this.accessibleTeacherContainers.length > 0) {
      this.filter();
      return;
    }
    this.accessibleTeacherContainers = this.searchTeachersByAge(parseInt(query, 10));
    if (this.accessibleTeacherContainers.length > 0) {
      this.filter();
      return;
    }
    this.update();
  }

  setVisible(teachers, visibility) {
    for (const teacher of teachers) {
      teacher.setVisible(visibility);
    }
  }

  updateVisibility() {
    if (this.firstFavoriteVisible + this.favoriteVisibleCount >= this.favoriteTeacherContainers.length) {
      if (this.favoriteVisibleCount <= this.favoriteTeacherContainers.length) {
        this.firstFavoriteVisible = this.favoriteTeacherContainers.length - this.favoriteVisibleCount;
      } else {
        this.firstFavoriteVisible = 0;
      }
    }
    for (let i = 0; i < this.favoriteTeacherContainers.length; i++) {
      if (i >= this.firstFavoriteVisible && i < this.firstFavoriteVisible + this.favoriteVisibleCount) {
        this.favoriteTeacherContainers[i].setFavoriteVisible(true);
      } else {
        this.favoriteTeacherContainers[i].setFavoriteVisible(false);
      }
    }
  }

  addFavoriteTeacherContainer(teacherContainer) {
    console.log('test');
    this.favoriteTeacherContainers.push(teacherContainer);
    this.favoriteTeachersList.appendChild(teacherContainer.getFavoriteTeacherCard());
    this.updateVisibility();
  }

  removeFavoriteTeacherContainer(teacherContainer) {
    for (let i = 0; i < this.favoriteTeacherContainers.length; i++) {
      if (this.favoriteTeacherContainers[i].getTeacher() === teacherContainer.getTeacher()) {
        this.favoriteTeacherContainers[i].getFavoriteTeacherCard().remove();
        this.favoriteTeacherContainers.splice(i, 1);
        break;
      }
    }
    this.updateVisibility();
  }

  showNext() {
    if (this.firstFavoriteVisible + this.favoriteVisibleCount < this.favoriteTeacherContainers.length) {
      this.firstFavoriteVisible++;
      this.updateVisibility();
    }
  }

  showPrevious() {
    if (this.firstFavoriteVisible > 0) {
      this.firstFavoriteVisible--;
      this.updateVisibility();
    }
  }
}

/* class FavoriteTeachers {
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
*/

function initFavoriteArrowButtons(favoriteTeachers) {
  const leftArrow = document.getElementById('left_arrow');
  const rightArrow = document.getElementById('right_arrow');
  leftArrow.addEventListener('click', () => {
    if (favoriteTeachers.firstFavoriteVisible > 0) {
      favoriteTeachers.showPrevious();
    }
  });
  rightArrow.addEventListener('click', () => {
    if (favoriteTeachers.firstFavoriteVisible + favoriteTeachers.favoriteVisibleCount < favoriteTeachers.favoriteTeacherContainers.length) {
      favoriteTeachers.showNext();
    }
  });
}

module.exports = {
  initFavoriteArrowButtons,
  TeacherList,
};
