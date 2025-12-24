<template>
  <div class="add-media">
    <h1>{{ isEditing ? 'Edit Show' : 'Add New Show or Movie' }}</h1>

    <div v-if="!hasApiKey" class="warning">
      <p>Please set your TMDB API Key in <router-link to="/settings">Settings</router-link> to use search.</p>
    </div>

    <div v-if="!isEditing" class="search-section">
      <input 
        v-model="searchQuery" 
        @keyup.enter="performSearch" 
        placeholder="Search for a movie or TV show..."
        :disabled="!hasApiKey"
      >
      <button @click="performSearch" :disabled="!hasApiKey || !searchQuery">Search</button>
    </div>

    <div v-if="hasSearched && searchResults.length === 0" class="no-results">
        No results found for "{{ lastSearchQuery }}".
    </div>
    
    <div v-if="searchResults.length > 0" class="results-list">
      <h3>Results</h3>
      <div 
        v-for="result in searchResults" 
        :key="result.id" 
        class="result-item"
        @click="selectResult(result)"
      >
        <img 
          v-if="result.poster_path" 
          :src="`https://image.tmdb.org/t/p/w92${result.poster_path}`" 
          alt="Poster"
        >
        <div class="result-info">
          <h4>{{ result.title || result.name }}</h4>
          <p>{{ result.media_type === 'movie' ? 'Movie' : 'TV Show' }} • {{ (result.release_date || result.first_air_date || '').substring(0, 4) }}</p>
        </div>
      </div>
    </div>

    <div v-if="selectedItem || isEditing" class="edit-form">
      <h3>{{ isEditing ? 'Edit Details' : 'Confirm Details' }}</h3>
      <form @submit.prevent="saveItem">
        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" required>
        </div>

        <div class="form-group">
          <label>Nickname (Optional)</label>
          <input v-model="form.nickname" placeholder="e.g. 'Boat Doctor'">
        </div>

        <div class="form-group">
          <label>Release Date</label>
          <input type="date" v-model="form.release_date">
        </div>

        <div class="form-group">
          <label>Type</label>
          <select v-model="form.type">
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
        </div>

        <div class="form-group">
          <label>Streaming Service</label>
          <select v-model="form.service" required>
            <option disabled value="">Select a service</option>
            <option value="Apple TV">Apple TV</option>
            <option value="Disney+">Disney+</option>
            <option value="HBO Max">HBO Max</option>
            <option value="Hulu">Hulu</option>
            <option value="Netflix">Netflix</option>
            <option value="Paramount+">Paramount+</option>
            <option value="Peacock">Peacock</option>
            <option value="Prime Video">Prime Video</option>
          </select>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status" :disabled="isFutureRelease">
            <option value="want_to_watch">Want to Watch</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
          </select>
          <p v-if="isFutureRelease" class="hint">Status locked to "Want to Watch" for unreleased items.</p>
        </div>

        <div class="form-group">
          <label>Synopsis</label>
          <textarea v-model="form.synopsis" rows="4"></textarea>
        </div>

        <div class="actions">
          <button v-if="isEditing" type="button" @click="deleteItem" class="delete-btn">Delete</button>
          <button type="button" @click="cancelEdit">Cancel</button>
          <button type="submit" class="primary">Save to List</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { searchMulti, getWatchProviders, checkApiKey } from '../services/tmdb';
import { addMediaItem, updateMediaItem, deleteMediaItem, mediaItems } from '../services/mediaStore';

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const lastSearchQuery = ref('');
const searchResults = ref([]);
const hasSearched = ref(false);
const selectedItem = ref(null);

const form = ref({
  id: null,
  name: '',
  nickname: '',
  type: 'movie',
  service: '',
  status: 'want_to_watch',
  synopsis: '',
  release_date: '',
  tmdb_id: null,
  poster_path: ''
});

const isEditing = computed(() => !!route.params.id);
const hasApiKey = ref(false);

const isFutureRelease = computed(() => {
  if (!form.value.release_date) return false;
  return new Date(form.value.release_date) > new Date();
});

watch(isFutureRelease, (isFuture) => {
  if (isFuture) {
    form.value.status = 'want_to_watch';
  }
});

onMounted(async () => {
  hasApiKey.value = await checkApiKey();

  if (isEditing.value) {
    const item = mediaItems.value.find(i => i.id === route.params.id);
    if (item) {
      form.value = { ...item };
    } else {
      router.push('/');
    }
  }
});

const performSearch = async () => {
  if (!searchQuery.value) return;
  try {
    const data = await searchMulti(searchQuery.value);
    searchResults.value = data.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv');
    hasSearched.value = true;
    lastSearchQuery.value = searchQuery.value;
    
    if (searchResults.value.length === 0) {
        searchQuery.value = '';
    }
  } catch (e) {
    alert(e.message);
  }
};

const selectResult = async (result) => {
  selectedItem.value = result;
  const type = result.media_type === 'movie' ? 'movie' : 'tv';
  
  form.value = {
    id: null, // New item
    name: result.title || result.name,
    nickname: '',
    type: type,
    service: '',
    status: 'want_to_watch',
    synopsis: result.overview,
    release_date: result.release_date || result.first_air_date || '',
    tmdb_id: result.id,
    poster_path: result.poster_path
  };
  
  searchResults.value = [];

  try {
    const data = await getWatchProviders(type, result.id);
    const usProviders = data.results?.US;
    
    if (usProviders && usProviders.flatrate) {
      const supportedServices = [
        'Apple TV', 'Disney+', 'HBO Max', 'Hulu', 'Netflix', 
        'Paramount+', 'Peacock', 'Prime Video'
      ];
      
      const match = usProviders.flatrate.find(p => {
        return supportedServices.some(s => p.provider_name.includes(s) || s.includes(p.provider_name));
      });

      if (match) {
        const exactMatch = supportedServices.find(s => match.provider_name.includes(s) || s.includes(match.provider_name));
        if (exactMatch) {
          form.value.service = exactMatch;
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch providers', e);
  }
};

const saveItem = async () => {
  try {
    let status = form.value.status;
    if (isEditing.value) {
      await updateMediaItem(form.value);
    } else {
      // Remove ID so addMediaItem generates a new one
      const { id, ...newItem } = form.value;
      await addMediaItem(newItem);
      status = newItem.status;
    }
    router.push({ path: '/', query: { tab: status } });
  } catch (e) {
    alert('Error saving item: ' + e.message);
  }
};

const deleteItem = async () => {
  if (confirm('Are you sure you want to delete this show?')) {
    try {
      await deleteMediaItem(form.value.id);
      router.push('/');
    } catch (e) {
      alert('Error deleting item: ' + e.message);
    }
  }
};

const cancelEdit = () => {
  router.push('/');
};
</script>

<style scoped>
.add-media {
  padding: 20px 20px 100px 20px; /* Added bottom padding to clear nav */
  max-width: 600px;
  margin: 0 auto;
}

.warning {
  background: #fff3cd;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-section input {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
}

.results-list {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.result-item:hover {
  background: #333;
}

.result-item img {
  width: 50px;
  height: 75px;
  object-fit: cover;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

button.primary {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}

.hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
  font-style: italic;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  margin-right: auto; /* Push to left */
}

.delete-btn:hover {
  background: #c82333;
}
</style>
