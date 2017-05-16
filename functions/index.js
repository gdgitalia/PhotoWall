const functions = require("firebase-functions");
const gcs = require("@google-cloud/storage")();
const vision = require("@google-cloud/vision")();
const admin = require("firebase-admin");
const spawn = require("child-process-promise").spawn;

admin.initializeApp(functions.config().firebase);

/**
 * When an image is uploaded we check if it is flagged as Adult or Violence by the Cloud Vision
 * API and if it is we just discard it.
 */
exports.discardOffensiveImages = functions.storage.object().onChange(event => {
  const object = event.data;
  const filePath = object.name;

  const fileName = filePath.split("/").pop();
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith("thumb_")) {
    console.log("Already a Thumbnail.");
    return;
  }

  const file = gcs.bucket(object.bucket).file(object.name);

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
      return resizeImage(object).then(data => {
        const file = data[0];
        return file.makePublic().then(() => {
          console.log(
            `http://storage.googleapis.com/${object.bucket}/${file.name}`
          );
          admin
            .database()
            .ref("images")
            .child(object.name.replace("images/", "").replace(".jpg", ""))
            .set(`http://storage.googleapis.com/${object.bucket}/${file.name}`);
        });
      });
    }
  });
});

function resizeImage(object) {
  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split("/").pop();
  const tempFilePath = `/tmp/${fileName}`;
  return bucket
    .file(filePath)
    .download({
      destination: tempFilePath
    })
    .then(() => {
      console.log("Image downloaded locally to", tempFilePath);

      return spawn("convert", [
        tempFilePath,
        "-thumbnail",
        "400x400>",
        tempFilePath
      ])
        .then(() => {
          console.log("Thumbnail created at", tempFilePath);
          // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
          const thumbFilePath = filePath.replace(
            /(\/)?([^\/]*)$/,
            "$1thumb_$2"
          );
          // Uploading the thumbnail.
          return bucket.upload(tempFilePath, {
            destination: thumbFilePath
          });
        })
        .catch(error => console.error(error));
    });
}
