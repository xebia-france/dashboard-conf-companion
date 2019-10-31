const shortid = require('shortid');

const getId = () => {
  let id = localStorage.getItem('user-id');
  if (!id) {
    id = shortid.generate();
    localStorage.setItem('user-id', id);
  }
  return id;
};

const getConferenceName = () => {
  const projectId = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIGURATION).projectId;
  switch (projectId) {
    case 'pcd-cc':
      return 'Paris Container Day';
    case 'dataxday-cc':
      return 'Data X Day';
    case 'frenchkit-app':
      return 'FrenchKit';
    case 'xebicon-c819e':
      return 'XebiCon';
    case 'agilelaval':
      return 'AgileLaval';
    default:
      return 'XKE';
  }
};

module.exports = {
  getId,
  getConferenceName,
};
