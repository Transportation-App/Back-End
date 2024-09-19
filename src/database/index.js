"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const database_2 = require("firebase/database");
class DBConnector {
    constructor() {
        // Initialize Firebase and Database
        const firebaseConfig = {
            apiKey: process.env.FireBase_apiKey,
            authDomain: process.env.FireBase_authDomain,
            databaseURL: process.env.FireBase_databaseURL,
            projectId: process.env.FireBase_projectId,
            storageBucket: process.env.FireBase_storageBucket,
            messagingSenderId: process.env.FireBase_messagingSenderId,
            appId: process.env.FireBase_appId,
            measurementId: process.env.FireBase_mesurementId,
        };
        // Initialize Firebase
        const fireBaseApp = (0, app_1.initializeApp)(firebaseConfig);
        this.database = (0, database_1.getDatabase)(fireBaseApp);
    }
    setValueListener(path, callback) {
        const listenerRef = (0, database_2.ref)(this.database, path);
        (0, database_2.onValue)(listenerRef, callback);
    }
    write(path, id, data) {
        (0, database_2.set)((0, database_2.ref)(this.database, `${path}/${id}`), Object.assign({}, data))
            .then(() => console.log("Payment saved successfully"))
            .catch(() => console.log("Error saving payment"));
    }
    read(path, id, onSuccess, onFail) {
        const dbRef = (0, database_2.ref)(this.database);
        const paymentRef = (0, database_1.child)(dbRef, `${path}/${id}`);
        (0, database_2.get)(paymentRef)
            .then((snapshot) => {
            if (snapshot.exists()) {
                onSuccess ? onSuccess(snapshot) : console.log(snapshot.val());
            }
            else {
                onFail
                    ? onFail(new Error("Data not available"))
                    : console.log("Data not available");
            }
        })
            .catch((error) => {
            onFail ? onFail(error) : console.log(error);
        });
    }
    update(path, id, data) {
        const dbRef = (0, database_2.ref)(this.database, `${path}/${id}`);
        const updates = {};
        updates[`${path}/${id}`] = data;
        return (0, database_1.update)(dbRef, updates);
    }
}
exports.default = DBConnector;
