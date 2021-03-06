const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
admin.initializeApp();

exports.getName = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    admin.auth().getUser(req.query.uid)
      .then((user) => {
        res.status(200).send({name: user.displayName});
        return user;
      })
      .catch((error) => {
        res.status(404).send(error);
        return error;
      });
  });
});
