const { searchUsersByQuery } = require('./process.js');

// eslint-disable-next-line no-shadow
function initSearch(teacherList) {
  const searchInput = document.querySelector('.search input[type=search]');
  const searchButton = document.querySelector('.search button');
  searchButton.onclick = () => {
    const query = searchInput.value;
    teacherList.search(query);
  };
  searchInput
    .addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value;
        teacherList.search(query);
      }
    });
}

module.exports = {
  initSearch,
};
