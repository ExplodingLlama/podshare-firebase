const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.getLink = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log(req.url);
    const id = req.url.substring(1);
    console.log("the id is", id);
    if (!id) {
      res.status(400).json("error: Id missing from request");
      return;
    }
    var links = db.collection("podlinks");
    links
      .doc(id)
      .get()
      .then(snapshot => {
        if (snapshot.empty || !snapshot.data()) {
          res.status(404).json("record not found");
        }
        res.status(200).json(snapshot.data());
        return;
      })
      .catch(err => {
        res.status(400).json("error: " + err);
        return;
      });
  });
});
