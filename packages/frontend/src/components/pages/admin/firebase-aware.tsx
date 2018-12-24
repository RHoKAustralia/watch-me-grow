import React, { ReactNode } from "react";
import firebase from "firebase";

type Props = {
  children: (user: firebase.User | null) => ReactNode;
};

type State = {
  user: firebase.User | null;
};

export default class FirebaseAware extends React.Component<Props, State> {
  state: State = {
    user: null
  };

  unsubscribe?: () => void;

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      const idToken = await (user && user.getIdToken());
      document.cookie =
        "__session=" + idToken + ";max-age=" + 60 * 60; /* Persistent 1 hour */
      this.setState({
        user
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    return this.props.children(this.state.user);
  }
}
