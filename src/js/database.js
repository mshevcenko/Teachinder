const databaseUrl = 'http://localhost:3002/teachers';

function post(teacher) {
  return fetch(databaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teacher),
  });
}

module.exports = {
  post,
};
