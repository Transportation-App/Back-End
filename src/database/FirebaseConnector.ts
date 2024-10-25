import { initializeApp } from "firebase/app";
import {
  child,
  DatabaseReference,
  getDatabase,
  push,
  update,
} from "firebase/database";
import {
  ref,
  set,
  onValue,
  get,
  DataSnapshot,
  Database,
} from "firebase/database";

class FirebaseConnector {
  private database: Database;

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
    const fireBaseApp = initializeApp(firebaseConfig);
    this.database = getDatabase(fireBaseApp);
  }

  public setValueListener(
    path: string,
    callback: (snapshot: DataSnapshot) => unknown
  ): () => void {
    const listenerRef: DatabaseReference = ref(this.database, path);

    const unsubscribe = onValue(listenerRef, callback, (error) => {
      console.error(`Error setting up listener at ${path}:`, error);
    });

    console.log(`Listener established on path: ${path}`);

    return () => {
      unsubscribe();
      console.log(`Listener removed from path: ${path}`);
    };
  }

  public write(path: string, id: string, data: object) {
    set(ref(this.database, `${path}/${id}`), {
      ...data,
    })
      .then(() => console.log("Payment saved successfully"))
      .catch(() => console.log("Error saving payment"));
  }

  public read(path: string, id: string): void;
  public read(
    path: string,
    id: string,
    onSuccess: (snapshot: DataSnapshot) => unknown
  ): void;
  public read(
    path: string,
    id: string,
    onSuccess: (snapshot: DataSnapshot) => unknown,
    onFail: (error: any) => unknown
  ): void;
  public read(
    path: string,
    id: string,
    onSuccess?: (snapshot: DataSnapshot) => unknown,
    onFail?: (error: any) => unknown
  ) {
    const dbRef = ref(this.database);
    const paymentRef = child(dbRef, `${path}/${id}`);

    get(paymentRef)
      .then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          onSuccess ? onSuccess(snapshot) : console.log(snapshot.val());
        } else {
          onFail
            ? onFail(new Error("Data not available"))
            : console.log("Data not available");
        }
      })
      .catch((error: any) => {
        onFail ? onFail(error) : console.log(error);
      });
  }

  public updateOne(path: string, id: string, data: object) {
    const dbRef = ref(this.database, `${path}/${id}`);
    const updates: any = {};
    updates[`${path}/${id}`] = data;
    return update(dbRef, updates);
  }

  public update(path: string, data: object) {
    const dbRef = ref(this.database, `${path}`);
    return update(dbRef, data);
  }
}

export default FirebaseConnector;
