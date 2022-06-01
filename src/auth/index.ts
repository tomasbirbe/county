import { create } from "domain";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4dKLVoLvCOcxNYSJ7Qi1eAg90V4Y6Q5k",
  authDomain: "county-944fb.firebaseapp.com",
  projectId: "county-944fb",
  storageBucket: "county-944fb.appspot.com",
  messagingSenderId: "222442525133",
  appId: "1:222442525133:web:4604793651ae0e30547484",
};

const app = initializeApp(firebaseConfig);

async function signIn(email: string, password: string) {
  const auth = getAuth();
  const userCredentials = await signInWithEmailAndPassword(auth, email, password);

  console.log(userCredentials);
}

async function signUp() {
  const { user, session, error } = await supabase.auth.signUp({
    email: "tomasespinosa9898@gmail.com",
    password: "123456",
  });

  console.log(user, session, error);
}

async function getSession() {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;

      return true;
    }
  });
}

export { signIn, signUp, getSession };
