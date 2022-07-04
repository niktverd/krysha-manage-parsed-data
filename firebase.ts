const {initializeApp} = require('firebase/app');
const {getFirestore} = require('firebase/firestore/lite');

const firebaseConfig = {
    apiKey: "AIzaSyA_-cNSFO_CUWTKczv152JkHykPZkcEdio",
    authDomain: "krysha-75fa9.firebaseapp.com",
    projectId: "krysha-75fa9",
    storageBucket: "krysha-75fa9.appspot.com",
    messagingSenderId: "178414230485",
    appId: "1:178414230485:web:24dccf802e70f603e53b5c"
};
  

const firebaseApp = initializeApp(firebaseConfig);

module.exports = getFirestore(firebaseApp);