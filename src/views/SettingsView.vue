<template>
  <div class="settings">
    <h1>Settings</h1>
    <div class="setting-item">
      <label for="tmdb-key">TMDB API Key:</label>
      <input id="tmdb-key" v-model="tmdbKey" type="text" placeholder="Enter your TMDB API Key">
      <button @click="saveKey" :disabled="loading">{{ loading ? 'Saving...' : 'Save' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getApiKey, saveApiKey } from '../services/tmdb';

const tmdbKey = ref('');
const loading = ref(false);

onMounted(async () => {
  try {
    const existingKey = await getApiKey();
    tmdbKey.value = existingKey || '';
  } catch (e) {
    console.error("Error fetching config:", e);
  }
});

const saveKey = async () => {
  loading.value = true;
  try {
    await saveApiKey(tmdbKey.value);
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
