<template>
  <div class="home">
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="actions-bar">
      <div v-if="currentTab !== 'recommendations'" class="filter-container">
        <input 
          v-model="filterQuery" 
          placeholder="Filter shows..." 
          class="filter-input"
        >
      </div>
      <button @click="$router.push('/add')" class="add-btn">+ Add New</button>
    </div>

    <div class="content">
      <div v-if="loadingRecommendations" class="loading">
        Loading recommendations...
      </div>
      <div v-else-if="filteredItems.length === 0" class="empty-state">
        <p v-if="filterQuery">No matches found for "{{ filterQuery }}".</p>
        <template v-else>
          <p>No items in "{{ currentTabLabel }}".</p>
          <p v-if="currentTab !== 'recommendations'">Add some shows to get started!</p>
        </template>
      </div>

      <div v-else class="media-grid">
        <ShowCard 
          v-for="item in filteredItems" 
          :key="item.id" 
          :item="item"
          :current-tab="currentTab"
          @move-status="moveStatus"
          @add-to-watchlist="addToWatchlist"
          @update-rating="updateRating"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { mediaItems, updateMediaItem, addMediaItem } from '../services/mediaStore';
import { getRecommendations, getWatchProviders } from '../services/tmdb';
import ShowCard from '../components/ShowCard.vue';

const currentTab = ref('watching');
const filterQuery = ref('');
const recommendations = ref([]);
const loadingRecommendations = ref(false);

const tabs = [
  { id: 'watching', label: 'Watching' },
  { id: 'want_to_watch', label: 'Want to Watch' },
  { id: 'watched', label: 'Watched' },
  { id: 'recommendations', label: 'Recommendations' }
];

const currentTabLabel = computed(() => tabs.find(t => t.id === currentTab.value)?.label);

const filteredItems = computed(() => {
  if (currentTab.value === 'recommendations') {
    return recommendations.value;
  }
  
  let items = mediaItems.value.filter(item => item.status === currentTab.value);
  
  if (filterQuery.value) {
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const nQuery = normalize(filterQuery.value);
    
    items = items.filter(item => {
      const nName = normalize(item.name);
      const nNickname = item.nickname ? normalize(item.nickname) : '';
      // Check if query matches start of any word in name or nickname
      // Prepending space ensures we match start of words
      return (" " + nName).includes(" " + nQuery) || 
             (" " + nNickname).includes(" " + nQuery);
    });
  }
  
  return items;
});

watch(currentTab, async (newTab) => {
  filterQuery.value = ''; // Clear filter on tab change
  if (newTab === 'recommendations') {
    await fetchRecommendations();
  }
});

const fetchRecommendations = async () => {
  loadingRecommendations.value = true;
  recommendations.value = [];
  
  // Get items that are "watched" or "watching" to base recommendations on
  // Ideally we'd use "loved" items, but we haven't implemented rating yet.
  // Let's use the last 3 items added to the list that have a TMDB ID.
  const sourceItems = mediaItems.value
    .filter(item => item.tmdb_id && (item.status === 'watched' || item.status === 'watching'))
    .slice(-3);

  if (sourceItems.length === 0) {
    loadingRecommendations.value = false;
    return;
  }

  const newRecs = new Map(); // Use Map to avoid duplicates

  const existingTmdbIds = new Set(mediaItems.value.map(item => item.tmdb_id).filter(id => id));

  for (const item of sourceItems) {
    try {
      const data = await getRecommendations(item.type, item.tmdb_id);
      
      // Process recommendations in parallel to get providers
      const recPromises = data.results.slice(0, 6).map(async (rec) => { // Limit to top 6 per source item
        if (newRecs.has(rec.id)) return;
        if (existingTmdbIds.has(rec.id)) return; // Skip if already in library

        let streamingService = '';
        try {
            const providers = await getWatchProviders(rec.media_type || item.type, rec.id);
            const usProviders = providers.results?.US?.flatrate;
            if (usProviders && usProviders.length > 0) {
                streamingService = usProviders[0].provider_name;
            }
        } catch (e) {
            // Ignore provider fetch errors
        }

        newRecs.set(rec.id, {
          id: `rec-${rec.id}`,
          tmdb_id: rec.id,
          name: rec.title || rec.name,
          type: rec.media_type || item.type, // Fallback to source type if missing
          service: 'Recommended',
          streamingService,
          synopsis: rec.overview,
          status: 'recommendation',
          poster_path: rec.poster_path
        });
      });

      await Promise.all(recPromises);
    } catch (e) {
      console.error(`Failed to get recs for ${item.name}`, e);
    }
  }
  
  recommendations.value = Array.from(newRecs.values());
  loadingRecommendations.value = false;
};

const addToWatchlist = (item) => {
    addMediaItem({
        name: item.name,
        type: item.type,
        service: item.streamingService || 'Unknown', // Default to found service or Unknown
        status: 'want_to_watch',
        tmdb_id: item.tmdb_id,
        poster_path: item.poster_path,
        synopsis: item.synopsis
    });
    
    // Remove from recommendations list
    recommendations.value = recommendations.value.filter(r => r.id !== item.id);
    
    currentTab.value = 'want_to_watch';
};

const moveStatus = (item, newStatus) => {
  updateMediaItem({ ...item, status: newStatus });
};

const updateRating = (item, rating) => {
  updateMediaItem({ ...item, rating });
};
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: #e2e8f0;
  color: #475569;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  font-weight: 600;
}

.tabs button:hover {
  background: #cbd5e1;
}

.tabs button.active {
  background: #42b983;
  color: white;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  color: #666;
  margin-top: 50px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.actions-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  flex: 1;
  margin-right: 20px;
}

.filter-input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.9rem;
}

.add-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.add-btn:hover {
  background: #3aa876;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
</style>
