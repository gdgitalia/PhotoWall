import React from "react";
import Webcam from "react-webcam";
import getOrientedImage from "exif-orientation-image";

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

  _resize = file => {
    const promise = new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      const reader = new FileReader();

      getOrientedImage(file, function(err, canvas) {
        if (err) {
          console.error(err);

          return;
        }

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = canvas.width;
        let height = canvas.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        img.src = canvas.toDataURL("image/jpg");

        img.onload = () => {
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpg"));
        };
      });

      reader.readAsDataURL(file);
    });
    return promise;
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);

    this.handleResize();
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
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

    this._resize(file).then(data => this._upload(data));

    this.setState({
      uploading: true
    });
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
          width={this.state.width}
          height={this.state.height}
          audio={false}
          ref={c => (this._camera = c)}
          screenshotFormat="image/jpeg"
        />

        <button className="capture-button" onClick={this.handleCapture}>
          Capture
        </button>
      </div>
    );
  }
}

export default Camera;
