// lib/firebaseclient.js
// This is an ES module (loaded with type="module" in the HTML), which is
// what lets us "import" pieces of Firebase straight from Google's CDN
// without installing anything or using a build tool.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Go to https://console.firebase.google.com, create a project, add a Web
// app to it, and Firebase will give you a config object like this one.
// Paste your own values in here.
const firebaseConfig = {
  apiKey: "AIzaSyBtVYhqwCQQ7ffzX-99t0uZji3DGKZz4Kk",
  authDomain: "review-grammar.firebaseapp.com",
  projectId: "review-grammar",
  storageBucket: "review-grammar.firebasestorage.app",
  messagingSenderId: "303523542867",
  appId: "1:303523542867:web:90927b4413f6fb6534d3a6",
  measurementId: "G-B2B46TNQ45"
};

// Detect the placeholder config that ships with the project. With these
// values every Firebase call fails in a confusing way, so we notice it
// here and fail with a clear message instead (and log instructions).
const usingPlaceholderConfig =
  firebaseConfig.apiKey === "YOUR_API_KEY" ||
  firebaseConfig.projectId === "YOUR_PROJECT_ID";

// Used by the window.firebase* helpers below when the config has not been
// filled in yet. The "api-key" code is what script.js looks for to show
// the "not set up yet" message instead of "wrong password".
function notSetUpReject() {
  const err = new Error(
    "Firebase is not set up yet - paste your project's config into lib/firebaseclient.js (see README.md)."
  );
  err.code = "auth/invalid-api-key";
  return Promise.reject(err);
}

if (usingPlaceholderConfig) {
  console.error(
    "Firebase is not set up yet!\n" +
    "Open lib/firebaseclient.js and replace the placeholder values in firebaseConfig\n" +
    "with the ones from your Firebase project (console.firebase.google.com).\n" +
    "See README.md, section 1."
  );
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// script.js is a plain (non-module) script, so it can't "import" this
// file directly. Instead we hang a few simple functions on window that
// script.js calls like normal functions.

window.firebaseLogin = function (email, password) {
  if (usingPlaceholderConfig) return notSetUpReject();
  return signInWithEmailAndPassword(auth, email, password);
};

// Creates a brand new account, then saves a small profile document for
// that user in Firestore (the "database" part of sign up).
window.firebaseSignup = function (email, password) {
  if (usingPlaceholderConfig) return notSetUpReject();
  return createUserWithEmailAndPassword(auth, email, password).then(function (result) {
    const user = result.user;
    return setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp()
    });
  });
};

window.firebaseLogout = function () {
  return signOut(auth);
};

// Fires once Firebase has checked whether someone is logged in, and again
// any time that changes. callback gets the user object, or null if no
// one is logged in.
window.onAuthReady = function (callback) {
  onAuthStateChanged(auth, callback);
};

// Saves one quiz attempt for whoever is currently logged in.
window.saveQuizScore = function (tenseKey, tenseLabel, score, total) {
  if (usingPlaceholderConfig) return notSetUpReject();
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error("Not logged in"));

  return addDoc(collection(db, "scores"), {
    uid: user.uid,
    email: user.email,
    tenseKey: tenseKey,
    tenseLabel: tenseLabel,
    score: score,
    total: total,
    createdAt: serverTimestamp()
  });
};

// Gets every past quiz attempt for whoever is currently logged in,
// newest first.
window.getQuizHistory = function () {
  if (usingPlaceholderConfig) return notSetUpReject();
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error("Not logged in"));

  const q = query(
    collection(db, "scores"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  return getDocs(q).then(function (snapshot) {
    return snapshot.docs.map(function (doc) {
      return doc.data();
    });
  });
};
