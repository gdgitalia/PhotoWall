import React from "react";
import Webcam from "react-webcam";

import { uploadImage } from "../utils/firebase";

function hasGetUserMedia() {
  return !!(navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
}

class Camera extends React.Component {
  state = {
    uploading: false
  };

  _upload = data => {
    uploadImage(data, {
      onDone: () => this.setState({ uploading: false }),
      onError: error => console.error(error)
    });
  };

  handleCapture = () => {
    const imageSrc = this._camera.getScreenshot();

    this.setState({
      uploading: true
    });

    this._upload(imageSrc);
  };

  handleInputChange = e => {
    const file = e.currentTarget.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => this._upload(reader.result), false);

    this.setState({
      uploading: true
    });

    reader.readAsDataURL(file);
  };

  render() {
    if (this.state.uploading) {
      return <h1>Uploading</h1>;
    }

    if (!hasGetUserMedia()) {
      return (
        <input
          onChange={this.handleInputChange}
          type="file"
          name="image"
          accept="image/*"
          capture
        />
      );
    }

    return (
      <div>
        <Webcam
          width={200}
          height={200}
          audio={false}
          ref={c => (this._camera = c)}
          screenshotFormat="image/jpeg"
        />

        <button onClick={this.handleCapture}>Capture</button>
      </div>
    );
  }
}

export default Camera;
