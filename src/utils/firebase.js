import firebase from "firebase";
import uuid from "uuid";

export const uploadImage = (data, {
  onDone,
  onError
}) => {
  const storageRef = firebase.storage().ref();

  const path = `images/${uuid.v4()}.jpg`;

  const uploadTask = storageRef.child(path).putString(data, "data_url");

  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;

      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    onError,
    onDone
  );
};