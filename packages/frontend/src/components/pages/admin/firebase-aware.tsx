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
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
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
