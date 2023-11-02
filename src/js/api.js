const { formatUsers } = require('./process.js');

const apiUrl = 'https://randomuser.me/api/';

function getTeachers(quantity = 1) {
  const url = `${apiUrl}?results=${quantity}`;
  return fetch(url, { method: 'GET' })
    .then((response) => (response.ok ? response.json() : Promise.reject(Error('Failed to get teachers'))))
    .then((res) => formatUsers(res.results))
    .catch((error) => { throw error; });
}

module.exports = {
  getTeachers,
};
