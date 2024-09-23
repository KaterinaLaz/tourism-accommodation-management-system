import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { FirebaseMessaging } from '@capacitor-firebase/messaging';

import { initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getDatabase } from '@firebase/database'
import { getFirestore } from "firebase/firestore"
import { getMessaging, getToken } from "firebase/messaging"


const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
   
  };
  

const app = initializeApp(config)
export const auth = getAuth(app)
export const database = getDatabase(app)
export const dataFire = getFirestore(app)
export const messaging = getMessaging(app)

