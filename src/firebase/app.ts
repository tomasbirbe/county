import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4dKLVoLvCOcxNYSJ7Qi1eAg90V4Y6Q5k",
  authDomain: "county-944fb.firebaseapp.com",
  projectId: "county-944fb",
  storageBucket: "county-944fb.appspot.com",
  messagingSenderId: "222442525133",
  appId: "1:222442525133:web:4604793651ae0e30547484",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
