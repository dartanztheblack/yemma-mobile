import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Configuration Firebase est gérée automatiquement par google-services.json
export { auth, firestore as db, storage };
