import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

async function verifyConnection() {
    try {
        console.log("Attempting to write to Firestore...");
        const docRef = await addDoc(collection(db, "test_connection"), {
            timestamp: new Date(),
            message: "Hello from Stream Track setup!"
        });
        console.log("Document written with ID: ", docRef.id);
        console.log("SUCCESS: Firestore connection verified!");
        process.exit(0);
    } catch (e) {
        console.error("Error adding document: ", e);
        process.exit(1);
    }
}

verifyConnection();
