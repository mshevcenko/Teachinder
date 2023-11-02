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

function initFilterCountries() {
  let html = '<option value="" selected>All</option>';
  for (const country of countries) {
    html += `<option value="${country}">${country}</option>`;
  }
  document.querySelector('.filter_teachers select[name=country_selection]').innerHTML = html;
}

function initFiltration(teacherList) {
  document.querySelector('.filter_teachers select[name=age_selection]')
    .addEventListener('change', () => {
      teacherList.filter();
    });
  document.querySelector('.filter_teachers select[name=country_selection]')
    .addEventListener('change', () => {
      teacherList.filter();
    });
  document.querySelector('.filter_teachers select[name=sex_selection]')
    .addEventListener('change', () => {
      teacherList.filter();
    });
  document.getElementById('favorites_checkbox')
    .addEventListener('click', () => {
      teacherList.filter();
    });
  document.getElementById('only_with_photo_checkbox')
    .addEventListener('click', () => {
      teacherList.filter();
    });
}

module.exports = {
  initFilterCountries,
  initFiltration,
};
