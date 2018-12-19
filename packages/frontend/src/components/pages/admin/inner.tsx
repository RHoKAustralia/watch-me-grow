import React from "react";
import firebase from "firebase";

import Auth from "./auth";
import FirebaseAware from "./firebase-aware";

const config = {
  apiKey: "AIzaSyDeG915nBTYC7BY2MCy2gJkcyhhfzKU4VA",
  authDomain: "watchmegrow-dev-afe2d.firebaseapp.com",
  databaseURL: "https://watchmegrow-dev-afe2d.firebaseio.com",
  projectId: "watchmegrow-dev-afe2d",
  storageBucket: "watchmegrow-dev-afe2d.appspot.com",
  messagingSenderId: "243000499593"
};
firebase.initializeApp(config);

export default class AdminInner extends React.Component {
  render() {
    return (
      <div>
        <h1>Admin</h1>
        <FirebaseAware>
          {user => {
            if (user) {
              return "You Are logged in as " + user.displayName;
            } else {
              return <Auth />;
            }
          }}
        </FirebaseAware>
      </div>
    );
  }
}
