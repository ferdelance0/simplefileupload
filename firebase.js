const firebase = require("firebase/app"); 

const firebaseConfig = {
    apiKey: "AIzaSyA1dVS7n0430QQt8G6IfSZ4p5YICTPJpT4",
    authDomain: "simpledfileupload.firebaseapp.com",
    projectId: "simpledfileupload",
    storageBucket: "simpledfileupload.appspot.com",
    messagingSenderId: "587580470807",
    appId: "1:587580470807:web:cf7b8297413769fb9ece52",
    measurementId: "G-P5W2E7LMVT"
  };
// Initialize Firebase
firebaseapp= firebase.initializeApp(firebaseConfig);

module.exports = firebaseapp;
