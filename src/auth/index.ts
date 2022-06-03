import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

export function signIn(email: string, password: string) {
  const auth = getAuth();

  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      localStorage.setItem("user", JSON.stringify(userCredentials.user));

      return userCredentials.user.uid;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export function register(email: string, password: string) {
  const auth = getAuth();

  return createUserWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  const auth = getAuth();

  return auth.signOut();
}

export function getSession() {
  const activeSession: User | null = JSON.parse(localStorage.getItem("user") || "null");

  if (activeSession) {
    return activeSession;
  }

  return null;
}
