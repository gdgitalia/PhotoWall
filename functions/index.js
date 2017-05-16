const functions = require("firebase-functions");
const gcs = require("@google-cloud/storage")();
const vision = require("@google-cloud/vision")();
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

/**
 * When an image is uploaded we check if it is flagged as Adult or Violence by the Cloud Vision
 * API and if it is we just discard it.
 */
exports.discardOffensiveImages = functions.storage.object().onChange(event => {
  const object = event.data;
  const file = gcs.bucket(object.bucket).file(object.name);

  console.log(event);

  // Exit if this is a move or deletion event.
  if (object.resourceState === "not_exists") {
    return console.log("This is a deletion event.");
  }

  // Check the image content using the Cloud Vision API.
  return vision.detectSafeSearch(file).then(data => {
    const safeSearch = data[0];
    console.log("SafeSearch results on image", safeSearch);

    if (safeSearch.adult || safeSearch.violence) {
      console.log("uh. this image was not safe");
    } else {
      return file.makePublic().then(() => {
        console.log(
          `http://storage.googleapis.com/${object.bucket}/${object.name}`
        );
        admin
          .database()
          .ref("images")
          .child(object.name.replace("images/", "").replace(".jpg", ""))
          .set(`http://storage.googleapis.com/${object.bucket}/${object.name}`);
      });
    }
  });
});
