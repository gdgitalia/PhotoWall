import React, { Component } from "react";
import firebase from "firebase";

const getImageSrc = src => src.replace(".com", ".com.rsz.io") + "?width=400";

class Wall extends Component {
  state = {
    images: []
  };

  componentDidMount() {
    const imagesRef = firebase
      .database()
      .ref()
      .child("images")
      .limitToLast(100);

    imagesRef.on("child_added", data => {
      this.setState(state => ({
        ...state,
        images: [...state.images, data.val()]
      }));
    });

    imagesRef.on("child_removed", data => {
      const val = data.val();
      this.setState(state => ({
        ...state,
        images: state.images.filter(x => x !== val)
      }));
    });
  }

  render() {
    const images = this.state.images;

    if (images.length === 0) {
      return null;
    }

    return (
      <div className="wall">
        {images.map(src => (
          <div className="wall__image-wrapper" key={src}>
            <img className="wall__image" src={getImageSrc(src)} />
          </div>
        ))}
      </div>
    );
  }
}

export default Wall;
