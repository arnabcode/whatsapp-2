import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyChgd1u-b8FA-OPAOo0-7Sk26cXi0Cz08U",
  authDomain: "whatsapp-2-961ec.firebaseapp.com",
  projectId: "whatsapp-2-961ec",
  storageBucket: "whatsapp-2-961ec.appspot.com",
  messagingSenderId: "922232747710",
  appId: "1:922232747710:web:cb72e9a369ac4f5c7950ef",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
