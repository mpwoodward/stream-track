import { ref } from 'vue';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = 'media_items';
const IGNORED_COLLECTION_NAME = 'ignored_items';
export const mediaItems = ref([]);
export const ignoredItems = ref([]);

let unsubscribe = null;

export const subscribeToMediaItems = () => {
    if (unsubscribe) return;

    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    unsubscribe = onSnapshot(q, (snapshot) => {
        mediaItems.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }, (error) => {
        console.error("Error fetching media items:", error);
    });
};

let unsubscribeIgnored = null;

export const subscribeToIgnoredItems = () => {
    if (unsubscribeIgnored) return;

    const q = query(collection(db, IGNORED_COLLECTION_NAME));
    unsubscribeIgnored = onSnapshot(q, (snapshot) => {
        ignoredItems.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }, (error) => {
        console.error("Error fetching ignored items:", error);
    });
};

export const unsubscribeFromMediaItems = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
        mediaItems.value = []; // Clear data on logout
    }
    if (unsubscribeIgnored) {
        unsubscribeIgnored();
        unsubscribeIgnored = null;
        ignoredItems.value = [];
    }
};

export const addMediaItem = async (item) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...item,
            createdAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const updateMediaItem = async (updatedItem) => {
    try {
        const { id, ...data } = updatedItem;
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, data);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
};

export const deleteMediaItem = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
};

export const addIgnoredItem = async (item) => {
    try {
        await addDoc(collection(db, IGNORED_COLLECTION_NAME), {
            tmdb_id: item.tmdb_id,
            type: item.type,
            name: item.name,
            createdAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error adding to ignored list: ", e);
        throw e;
    }
};

