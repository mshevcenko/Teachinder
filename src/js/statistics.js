const { sortUsers } = require('./process.js');

class Statistics {
  constructor(teachers = []) {
    this.teachers = [...teachers];
    this.currentPage = 1;
    this.sortParam = '';
    this.descending = false;
    this.init();
  }

  init() {
    this.initStatisticsButtons();
    this.showPage(this.currentPage);
  }

  update(teachers, page = 1) {
    this.teachers = [...teachers];
    sortUsers(this.teachers, this.sortParam, this.descending);
    this.showPage(page);
  }

  static resetStatisticsButtonsOrder() {
    for (const statisticButton of document.querySelectorAll('#statistic_table th')) {
      statisticButton.classList.remove('ascending');
    }
  }

  initStatisticButton(buttonClass, param) {
    const statistics = this;
    const statisticButton = document.querySelector(`#statistic_table .${buttonClass}`);
    statisticButton.addEventListener('click', () => {
      if (statisticButton.classList.contains('ascending')) {
        statisticButton.classList.remove('ascending');
        sortUsers(statistics.teachers, param, true);
        statistics.sortParam = param;
        statistics.descending = true;
        statistics.showPage(statistics.currentPage);
      } else {
        Statistics.resetStatisticsButtonsOrder();
        statisticButton.classList.add('ascending');
        sortUsers(statistics.teachers, param);
        statistics.sortParam = param;
        statistics.descending = false;
        statistics.showPage(statistics.currentPage);
      }
    });
  }

  initStatisticsButtons() {
    this.initStatisticButton('sort_by_name', 'full_name');
    this.initStatisticButton('sort_by_speciality', 'course');
    this.initStatisticButton('sort_by_age', 'age');
    this.initStatisticButton('sort_by_gender', 'gender');
    this.initStatisticButton('sort_by_nationality', 'country');
  }

  showPage(page) {
    this.currentPage = page;
    let html = '';
    const last = Math.min(page * 10, this.teachers.length);
    for (let i = (page - 1) * 10; i < last; i++) {
      html += `<tr>
                <td>${this.teachers[i].full_name}</td>
                <td>${this.teachers[i].course}</td>
                <td>${this.teachers[i].age}</td>
                <td>${this.teachers[i].gender}</td>
                <td>${this.teachers[i].country}</td>
             </tr>`;
    }
    document.querySelector('#statistic_table tbody').innerHTML = html;
    this.updatePagination();
  }

  createPaginationElement(text, className) {
    const span = document.createElement('span');
    span.innerText = text;
    span.classList.add(className);
    if (className === 'pagination_link') {
      const statistics = this;
      span.addEventListener('click', () => {
        statistics.showPage(parseInt(text, 10));
      });
    }
    return span;
  }

  updatePagination() {
    const current = this.currentPage;
    const left = current - 1;
    const right = current + 1;
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';
    const fragment = document.createDocumentFragment();
    if (this.teachers.length === 0) {
      return;
    }
    const last = parseInt((this.teachers.length + 9) / 10, 10);
    if (current === 1) {
      fragment.appendChild(this.createPaginationElement(current, 'pagination_link_chosen'));
      if (last <= 3) {
        for (let i = 2; i <= last; i++) {
          fragment.appendChild(this.createPaginationElement(i, 'pagination_link'));
        }
      } else {
        fragment.appendChild(this.createPaginationElement(2, 'pagination_link'));
        fragment.appendChild(this.createPaginationElement('...', 'pagination_dots'));
        fragment.appendChild(this.createPaginationElement(last, 'pagination_link'));
      }
      pagination.appendChild(fragment);
      return;
    }
    if (current === last) {
      if (last <= 3) {
        for (let i = 1; i < last; i++) {
          fragment.appendChild(this.createPaginationElement(i, 'pagination_link'));
        }
      } else {
        fragment.appendChild(this.createPaginationElement(1, 'pagination_link'));
        fragment.appendChild(this.createPaginationElement('...', 'pagination_dots'));
        fragment.appendChild(this.createPaginationElement(last - 1, 'pagination_link'));
      }
      fragment.appendChild(this.createPaginationElement(current, 'pagination_link_chosen'));
      pagination.appendChild(fragment);
      return;
    }
    fragment.appendChild(this.createPaginationElement(1, 'pagination_link'));
    if (left === 2) {
      fragment.appendChild(this.createPaginationElement(2, 'pagination_link'));
    } else if (left > 2) {
      fragment.appendChild(this.createPaginationElement('...', 'pagination_dots'));
      fragment.appendChild(this.createPaginationElement(left, 'pagination_link'));
    }
    fragment.appendChild(this.createPaginationElement(current, 'pagination_link_chosen'));
    if (right === last - 1) {
      fragment.appendChild(this.createPaginationElement(right, 'pagination_link'));
    } else if (right < last - 1) {
      fragment.appendChild(this.createPaginationElement(right, 'pagination_link'));
      fragment.appendChild(this.createPaginationElement('...', 'pagination_dots'));
    }
    fragment.appendChild(this.createPaginationElement(last, 'pagination_link'));
    pagination.appendChild(fragment);
  }
}

/* function updateStatistics(teachers) {
  let html = '';
  for (let i = 0; i < 10; i++) {
    html += `<tr>
                <td>${teachers[i].full_name}</td>
                <td>${teachers[i].course}</td>
                <td>${teachers[i].age}</td>
                <td>${teachers[i].gender}</td>
                <td>${teachers[i].country}</td>
             </tr>`;
  }
  document.querySelector('#statistic_table tbody').innerHTML = html;
}

function resetStatisticsButtonsOrder() {
  for (const statisticButton of document.querySelectorAll('#statistic_table th')) {
    statisticButton.classList.remove('ascending');
  }
}

function initStatisticButton(teachers, buttonClass, param) {
  const statisticButton = document.querySelector(`#statistic_table .${buttonClass}`);
  statisticButton.addEventListener('click', () => {
    if (statisticButton.classList.contains('ascending')) {
      statisticButton.classList.remove('ascending');
      updateStatistics(sortUsers(teachers, param, true));
    } else {
      resetStatisticsButtonsOrder();
      statisticButton.classList.add('ascending');
      updateStatistics(sortUsers(teachers, param));
    }
  });
}

function initStatisticsButtons(teachers) {
  initStatisticButton(teachers, 'sort_by_name', 'full_name');
  initStatisticButton(teachers, 'sort_by_speciality', 'course');
  initStatisticButton(teachers, 'sort_by_age', 'age');
  initStatisticButton(teachers, 'sort_by_gender', 'gender');
  initStatisticButton(teachers, 'sort_by_nationality', 'country');
} */

module.exports = {
  Statistics,
};
