import { ref } from 'vue';

const STORAGE_KEY = 'stream_track_items';

export const mediaItems = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

export const addMediaItem = (item) => {
    mediaItems.value.push({
        id: Date.now().toString(),
        ...item,
        createdAt: new Date().toISOString()
    });
    saveToStorage();
};

export const updateMediaItem = (updatedItem) => {
    const index = mediaItems.value.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
        mediaItems.value[index] = updatedItem;
        saveToStorage();
    }
};

export const deleteMediaItem = (id) => {
    mediaItems.value = mediaItems.value.filter(item => item.id !== id);
    saveToStorage();
};

const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaItems.value));
};
