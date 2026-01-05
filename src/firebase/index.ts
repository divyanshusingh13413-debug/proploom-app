import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSdWWB1L5zcwJyckdI_a1X6-iUqD_GClk",
  authDomain: "propcall-360.firebaseapp.com",
  projectId: "propcall-360",
  storageBucket: "propcall-360.appspot.com",
  messagingSenderId: "99461675146",
  appId: "1:99461675146:web:b34232f5c80ebdf1d0d573"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
