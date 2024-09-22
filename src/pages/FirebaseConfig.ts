import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { FirebaseMessaging } from '@capacitor-firebase/messaging';

import { initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getDatabase } from '@firebase/database'
import { getFirestore } from "firebase/firestore"


const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
   
  };
  

const app = initializeApp(config)
export const auth = getAuth(app)
export const database = getDatabase(app)
export const dataFire = getFirestore(app)


