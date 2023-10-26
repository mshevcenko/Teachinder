const { sortUsers } = require('./process.js');

function updateStatistics(teachers) {
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
}

module.exports = {
  initStatisticButton,
  initStatisticsButtons,
  updateStatistics,
};
