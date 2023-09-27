const admin = require("firebase/app");
const { getFirestore } = require("firebase/firestore/lite");

const firebaseConfig = {
  apiKey: "AIzaSyCvYFOKuTJR8w_yl2jtDtA__8rT80FEXuk",
  authDomain: "teamknowlogy-5130c.firebaseapp.com",
  projectId: "teamknowlogy-5130c",
  storageBucket: "teamknowlogy-5130c.appspot.com",
  messagingSenderId: "33524884360",
  appId: "1:33524884360:web:dde01f5a887dc90123d03d",
};

const app = admin.initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
