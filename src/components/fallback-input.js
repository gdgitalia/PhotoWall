import React from "react";
import Webcam from "react-webcam";
import getOrientedImage from "exif-orientation-image";

class FallbackInput extends React.Component {
  state = {
    uploading: false
  };

  render() {
    return (
      <div className="fallback-input">

        <p className="fallback-input__text">
          Oh noes! Your device doesn't support `getUserMedia`!
          But you can still upload an image using the input below!
        </p>
        <input
          onChange={this.props.onChange}
          type="file"
          name="image"
          accept="image/*"
          capture
          id="upload-photo"
        />

        <label className="fallback-input__label" htmlFor="upload-photo">
          Upload a photo
        </label>
      </div>
    );
  }
}

export default FallbackInput;
