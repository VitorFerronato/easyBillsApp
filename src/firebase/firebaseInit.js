import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBRyt2nZutVkmVOWbYNI0BrIUM54Grr9GM",
    authDomain: "invoice-app-vue-5770c.firebaseapp.com",
    projectId: "invoice-app-vue-5770c",
    storageBucket: "invoice-app-vue-5770c.appspot.com",
    messagingSenderId: "233057997751",
    appId: "1:233057997751:web:3e03f4c6a9e2bc07ac0e32"
};

initializeApp(firebaseConfig)

const db = getFirestore()

export default db