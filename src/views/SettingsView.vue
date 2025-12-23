<template>
  <div class="settings">
    <h1>Settings</h1>
    <div class="setting-item">
      <label for="tmdb-key">TMDB API Key:</label>
      <input id="tmdb-key" v-model="tmdbKey" type="text" placeholder="Enter your TMDB API Key">
      <button @click="saveKey">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const tmdbKey = ref('');
const loading = ref(false);

onMounted(async () => {
  try {
    const docRef = doc(db, 'config', 'tmdb');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      tmdbKey.value = docSnap.data().key || '';
    } else {
      // Fallback/Legacy check
      const storedKey = localStorage.getItem('tmdb_api_key');
      if (storedKey) tmdbKey.value = storedKey;
    }
  } catch (e) {
    console.error("Error fetching config:", e);
  }
});

const saveKey = async () => {
  loading.value = true;
  try {
    await setDoc(doc(db, 'config', 'tmdb'), { key: tmdbKey.value });
    // Also update local storage just in case until full migration
    localStorage.setItem('tmdb_api_key', tmdbKey.value);
    alert('API Key saved to database! It will now persist everywhere.');
  } catch (e) {
    console.error("Error saving key:", e);
    alert('Error saving key to database. Check permissions?');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.settings {
  padding: 20px;
}
.setting-item {
  margin-top: 20px;
}
input {
  padding: 8px;
  margin-right: 10px;
  width: 300px;
}
</style>
