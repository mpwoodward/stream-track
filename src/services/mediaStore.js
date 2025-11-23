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
export const mediaItems = ref([]);

// Subscribe to real-time updates
const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
onSnapshot(q, (snapshot) => {
    mediaItems.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}, (error) => {
    console.error("Error fetching media items:", error);
});

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

