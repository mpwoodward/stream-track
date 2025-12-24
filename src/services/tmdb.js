import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BASE_URL = 'https://api.themoviedb.org/3';
let cachedKey = null;

export const checkApiKey = async () => {
    const key = await getApiKey();
    return !!key;
};

const getApiKey = async () => {
    if (cachedKey) return cachedKey;

    // 1. Try Firestore
    try {
        const docRef = doc(db, 'config', 'tmdb');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().key) {
            cachedKey = docSnap.data().key;
            return cachedKey;
        }
    } catch (e) {
        console.error("Error fetching TMDB key from DB:", e);
    }

    // 2. Fallback to LocalStorage
    return localStorage.getItem('tmdb_api_key');
};

export const searchMulti = async (query) => {
    const apiKey = await getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
};

export const getDetails = async (type, id) => {
    const apiKey = await getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${apiKey}`);
    if (!response.ok) throw new Error('Fetch details failed');
    return response.json();
};

export const getRecommendations = async (type, id, page = 1) => {
    const apiKey = await getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${apiKey}&page=${page}`);
    if (!response.ok) throw new Error('Fetch recommendations failed');
    return response.json();
};

export const getWatchProviders = async (type, id) => {
    const apiKey = await getApiKey();
    if (!apiKey) throw new Error('Missing API Key');

    const response = await fetch(`${BASE_URL}/${type}/${id}/watch/providers?api_key=${apiKey}`);
    if (!response.ok) throw new Error('Fetch watch providers failed');
    return response.json();
};
