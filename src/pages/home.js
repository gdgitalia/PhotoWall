import React, { Component } from "react";
import firebase from "firebase";

import Camera from "../components/camera";

class Home extends Component {
  state = {
    images: []
  };

  render() {
    return (
      <div>
        <Camera />
      </div>
    );
  }
}

export default Home;
