import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";

import Wall from "./pages/wall";
import Home from "./pages/home";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  state = {
    initialised: false
  };

  componentDidMount() {
    var config = {
      apiKey: "AIzaSyB8vxKTLCya54Oau5o3IMw1fzUTgrzJleg",
      authDomain: "photowall-69eee.firebaseapp.com",
      databaseURL: "https://photowall-69eee.firebaseio.com",
      projectId: "photowall-69eee",
      storageBucket: "photowall-69eee.appspot.com",
      messagingSenderId: "483060185820"
    };
    firebase.initializeApp(config);

    this.setState({
      initialised: true
    });
  }

  render() {
    if (!this.state.initialised) {
      return null;
    }

    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/wall" component={Wall} />
        </div>
      </Router>
    );
  }
}

export default App;
