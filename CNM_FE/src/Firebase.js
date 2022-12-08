import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA1TyorXh6YOf839YVnCGUZyOGXDqjYlOI",
    authDomain: "cnm-zolachat.firebaseapp.com",
    projectId: "cnm-zolachat",
    storageBucket: "cnm-zolachat.appspot.com",
    messagingSenderId: "776709358055",
    appId: "1:776709358055:web:6cfbdc7e67da351bbffd42",
    measurementId: "G-95FZTZVTQS"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
export { auth, firebase };