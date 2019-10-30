const shortid = require('shortid');

const getId = () => {
  let id = localStorage.getItem('user-id');
  if (!id) {
    id = shortid.generate();
    localStorage.setItem('user-id', id);
  }
  return id;
};

module.exports = {
  getId,
};
