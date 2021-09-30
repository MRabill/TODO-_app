var firebaseConfig = {
    apiKey: "AIzaSyANAj4_PujK9l5aJ7BnQkTc31qmXOaGyxI",
    authDomain: "to-do-list-b462e.firebaseapp.com",
    projectId: "to-do-list-b462e",
    storageBucket: "to-do-list-b462e.appspot.com",
    messagingSenderId: "641684405101",
    appId: "1:641684405101:web:77ab766f67ab359bd7f864",
    measurementId: "G-7K42Z01KZV"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();