import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import firebase, { auth } from "../Services/firebase";
import MainNav from "./MainNav";
import Query from "./Query";
import QueryAll from "./QueryAll";
import Create from "./Create";

const initialState = {
  ready: false,
  user: null,
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      ...initialState,
    };
  }

  signInWithAuthProvider = (providerId) => {
    return new Promise((resolve, reject) => {
      if (!providerId) {
        reject();
        return;
      }
      const provider = new firebase.auth.OAuthProvider(providerId);
      if (!provider) {
        reject();
        return;
      }
      if (auth.currentUser) {
        reject();
        return;
      }
      auth.signInWithPopup(provider).then((value) => {
        const user = value.user;
        if (!user) {
          reject();
          return;
        }
        const uid = user.uid;
        if (!uid) {
          reject();
          return;
        }
        resolve(user);
      });
    });
  };

  signOut = () => {
    return new Promise((resolve, reject) => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        reject();
        return;
      }
      auth
        .signOut()
        .then((value) => {
          resolve(value);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  };

  resetState = (callback) => {
    this.setState(
      {
        ready: true,
        user: null,
      },
      callback
    );
  };

  selectPageHandler = (value) => {
    this.setState({
      ...this.state,
      page: value.value,
    });
  };

  render() {
    const { ready, user } = this.state;

    return (
      <Paper classes={{ root: "Page-container" }}>
        <MainNav selectPage={this.selectPageHandler} />

        {this.state.page === 0 ? (
          <Query
            switchFeedHandler={this.props.switchFeedHandler}
            socket={this.props.socket}
            connected={this.props.connected}
          />
        ) : null}
        {this.state.page === 1 ? (
          <QueryAll
            switchFeedHandler={this.props.switchFeedHandler}
            socket={this.props.socket}
            connected={this.props.connected}
            ready={ready}
            user={user}
            signIn={() => this.signInWithAuthProvider("google.com")}
            signOut={() => this.signOut()}
          />
        ) : null}
        {this.state.page === 2 ? (
          <Create
            switchFeedHandler={this.props.switchFeedHandler}
            socket={this.props.socket}
            connected={this.props.connected}
            ready={ready}
            user={user}
            signIn={() => this.signInWithAuthProvider("google.com")}
            signOut={() => this.signOut()}
          />
        ) : null}
      </Paper>
    );
  }

  componentDidMount() {
    this.onAuthStateChangedObserver = auth.onAuthStateChanged((user) => {
      this.setState({
        ready: true,
        user: user,
      });
    });
  }

  componentWillUnmount() {
    if (this.onAuthStateChangedObserver) {
      this.onAuthStateChangedObserver();
    }
  }
}

export default Main;
