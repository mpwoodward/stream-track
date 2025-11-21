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

const tmdbKey = ref('');

onMounted(() => {
  const storedKey = localStorage.getItem('tmdb_api_key');
  if (storedKey) {
    tmdbKey.value = storedKey;
  }
});

const saveKey = () => {
  localStorage.setItem('tmdb_api_key', tmdbKey.value);
  alert('API Key saved!');
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
