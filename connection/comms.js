import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";
import {saveData} from "./AsyncStorage";

firebase.initializeApp(firebaseConfig);

export const Firebase = {
    loginWithEmail: (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            return firebase.firestore()
                .collection("users")
                .doc(res.user.uid)
                .get()
                .then((snapshot) => {
                    console.log("FROM FIREBASE, Saving user in storage.")
                    saveData(snapshot.data()).then()
                    return (snapshot.data())
                });
        });
    },
    updateCity: (city, uid) => {
        return firebase.firestore()
            .collection("users")
            .doc(uid)
            .update({city: city})
            .then(() => {
                console.log("Updating city...")
                return true
            });
    },
    signupWithEmail: (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    },
    signOut: () => {
        return firebase.auth().signOut();
    },
    checkUserAuth: user => {
        return firebase.auth().onAuthStateChanged(user);
    },
    passwordReset: email => {
        return firebase.auth().sendPasswordResetEmail(email);
    },
    createNewUser: userData => {
        return firebase
            .firestore()
            .collection("users")
            .doc(`${userData.uid}`)
            .set(userData);
    },
    getTrainsWithUserCity: (city) => {
        console.log(city)
        return firebase
            .firestore()
            .collection("trains")
            .where("dStation", "==", city)
            .get()
            .then((snapshot) => {
                let dataArray = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data()
                    data.uid = doc.id
                    dataArray.push(data)
                });
                return dataArray
            });
    },
};

export const Fetch = {
    getData: (stationCode) => {
        const URL = "http://transportapi.com/v3/uk/train/station/"+stationCode+"/live.json?app_id=d40b0b1a&app_key=0f0404c12a6bdebfb462189386af7263"
        return fetch(URL, {
            method: 'get',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        }).catch(r => {
            console.log(r)
        });
    }
}

