import React from "react";
import firebase from "firebase";

import Auth from "./auth";
import FirebaseAware from "./firebase-aware";
import Downloads from "./downloads";

import Styles from "./inner.module.scss";

const devConfig = {
  apiKey: "AIzaSyDeG915nBTYC7BY2MCy2gJkcyhhfzKU4VA",
  authDomain: "watchmegrow-dev-afe2d.firebaseapp.com",
  databaseURL: "https://watchmegrow-dev-afe2d.firebaseio.com",
  projectId: "watchmegrow-dev-afe2d",
  storageBucket: "watchmegrow-dev-afe2d.appspot.com",
  messagingSenderId: "243000499593"
};
const prodConfig = {
  apiKey: "AIzaSyC0mkzdVXQGr7G6Ms51jPIVakCqgn7xJJU",
  authDomain: "watchmegrow-prod.firebaseapp.com",
  databaseURL: "https://watchmegrow-prod.firebaseio.com",
  projectId: "watchmegrow-prod",
  storageBucket: "watchmegrow-prod.appspot.com",
  messagingSenderId: "850399193100"
};

firebase.initializeApp(process.env.REACT_APP_IS_PROD ? prodConfig : devConfig);

export default class AdminInner extends React.Component {
  logout = () => {
    firebase.auth().signOut();
  };

  render() {
    return (
      <div className={Styles.root}>
        <h1>Admin</h1>
        <FirebaseAware>
          {(user, loaded) => {
            if (loaded) {
              if (user) {
                return (
                  <React.Fragment>
                    You Are logged in as {user.displayName}.{" "}
                    <button onClick={this.logout}>Log Out</button>
                    <Downloads />
                  </React.Fragment>
                );
              } else {
                return <Auth />;
              }
            } else {
              return "Loading...";
            }
          }}
        </FirebaseAware>
      </div>
    );
  }
}
