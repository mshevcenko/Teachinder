const { searchUsersByQuery } = require('./process.js');

// eslint-disable-next-line no-shadow
function initSearch(allTeachers, teacherList) {
  const searchButton = document.querySelector('.search button');
  searchButton.onclick = () => {
    const query = document.querySelector('.search input[type=search]').value;
    const searchedTeachers = searchUsersByQuery(allTeachers, query);
    teacherList.setTeachers(searchedTeachers);
  };
  document.querySelector('.search input[type=search]')
    .addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = document.querySelector('.search input[type=search]').value;
        const searchedTeachers = searchUsersByQuery(allTeachers, query);
        teacherList.setTeachers(searchedTeachers);
      }
    });
}

module.exports = {
  initSearch,
};
