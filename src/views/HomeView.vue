<template>
  <div class="home">
    <div class="sticky-header">
      <div class="actions-bar">
        <div v-if="currentTab !== 'recommendations'" class="filter-container">
          <input 
            v-model="filterQuery" 
            placeholder="Filter shows..." 
            class="filter-input"
          >
        </div>
        <button @click="$router.push('/add')" class="add-btn">{{ filterQuery || currentTab === 'recommendations' ? '+ Add' : '+ Add New' }}</button>
      </div>
    </div>

    <div class="content">
      <div v-if="loadingRecommendations && recommendations.length === 0" class="loading">
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
          @not-interested="markNotInterested"
        />
      </div>

      <div v-if="currentTab === 'recommendations' && recommendations.length > 0" class="load-more-container">
        <button @click="fetchRecommendations(true)" class="load-more-btn" :disabled="loadingRecommendations">
          {{ loadingRecommendations ? 'Loading...' : 'Show more recommendations ...' }}
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="nav-item"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        <span class="icon">{{ tab.icon }}</span>
        <span class="label">{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mediaItems, ignoredItems, updateMediaItem, addMediaItem, addIgnoredItem, subscribeToMediaItems, unsubscribeFromMediaItems, subscribeToIgnoredItems } from '../services/mediaStore';
import { getRecommendations, getWatchProviders } from '../services/tmdb';
import ShowCard from '../components/ShowCard.vue';

const router = useRouter();
const route = useRoute();
const currentTab = ref('watching');
const filterQuery = ref('');

const recommendations = ref([]);
const loadingRecommendations = ref(false);
const recPage = ref(1);

const tabs = [
  { id: 'watching', label: 'Watching', icon: '📺' },
  { id: 'want_to_watch', label: 'To Watch', icon: '🔖' },
  { id: 'watched', label: 'Watched', icon: '✅' },
  { id: 'recommendations', label: 'For You', icon: '✨' }
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
      return (" " + nName).includes(" " + nQuery) || 
             (" " + nNickname).includes(" " + nQuery);
    });
  }
  
  return items;
});

// Sync tab with URL
onMounted(() => {
  if (route.query.tab && tabs.some(t => t.id === route.query.tab)) {
    currentTab.value = route.query.tab;
  }
});

// Update URL when tab changes
watch(currentTab, async (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
  
  filterQuery.value = ''; // Clear filter on tab change
  if (newTab === 'recommendations') {
    await fetchRecommendations();
  }
});

// Update tab if URL changes (e.g. back button)
watch(() => route.query.tab, (newTab) => {
  if (newTab && tabs.some(t => t.id === newTab) && newTab !== currentTab.value) {
    currentTab.value = newTab;
  }
});

const fetchRecommendations = async (isLoadMore = false) => {
  loadingRecommendations.value = true;
  
  if (!isLoadMore) {
    recommendations.value = [];
    recPage.value = 1;
  } else {
    recPage.value++;
  }
  
  const sourceItems = mediaItems.value
    .filter(item => item.tmdb_id && (item.status === 'watched' || item.status === 'watching'))
    .slice(-3);

  if (sourceItems.length === 0) {
    loadingRecommendations.value = false;
    return;
  }

  // Pre-seed with current recommendation IDs so we don't accidentally duplicate
  const newRecs = new Map();
  if (isLoadMore) {
    recommendations.value.forEach(r => newRecs.set(r.tmdb_id, r));
  }
  
  const existingTmdbIds = new Set([

      ...mediaItems.value.map(item => item.tmdb_id),
      ...ignoredItems.value.map(item => item.tmdb_id)
  ].filter(id => id));

  for (const item of sourceItems) {
    try {
      const data = await getRecommendations(item.type, item.tmdb_id, recPage.value);
      
      const recPromises = data.results.slice(0, 6).map(async (rec) => {
        if (newRecs.has(rec.id)) return;
        if (existingTmdbIds.has(rec.id)) return;

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
          type: rec.media_type || item.type,
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

const addToWatchlist = async (item) => {
    try {
        await addMediaItem({
            name: item.name,
            type: item.type,
            service: item.streamingService || 'Unknown',
            synopsis: item.synopsis,
            status: 'want_to_watch' // Force status validation
        });
        
        recommendations.value = recommendations.value.filter(r => r.id !== item.id);
        currentTab.value = 'want_to_watch';
    } catch (e) {
        console.error("Error adding to watchlist:", e);
    }
};

const markNotInterested = async (item) => {
    // Optimistic remove
    recommendations.value = recommendations.value.filter(r => r.id !== item.id);
    try {
        await addIgnoredItem(item);
    } catch (e) {
        console.error("Error marking not interested:", e);
    }
};

const moveStatus = async (item, newStatus) => {
  if (item.status === 'recommendation') {
      // Handle "Already Watched" from Recs tab
      try {
        await addMediaItem({
            name: item.name,
            type: item.type,
            service: item.streamingService || 'Unknown',
            status: 'watched', // Directly to watched
            tmdb_id: item.tmdb_id,
            poster_path: item.poster_path,
            synopsis: item.synopsis
        });
        recommendations.value = recommendations.value.filter(r => r.id !== item.id);
        currentTab.value = 'watched';
      } catch (e) {
        console.error("Error adding watched recommendation:", e);
      }
      return;
  }
  
  try {
    await updateMediaItem({ ...item, status: newStatus });
  } catch (e) {
    console.error("Error moving status:", e);
  }
};

const updateRating = async (item, rating) => {
  try {
    await updateMediaItem({ ...item, rating });
  } catch (e) {
    console.error("Error updating rating:", e);
  }
};
</script>

<style scoped>
.home {
  padding: 10px 20px 80px 20px; /* Added bottom padding for nav */
  max-width: 800px;
  margin: 0 auto;
}

.sticky-header {
  position: sticky;
  top: 65px;
  z-index: 90;
  background-color: #ffffff;
  padding-top: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f1f1;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.filter-container {
  flex: 1;
}

.filter-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 25px; /* Softer pill shape */
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.filter-input:focus {
  background: white;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.add-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px; /* Match input */
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgba(66, 185, 131, 0.3);
  transition: transform 0.1s;
}

.add-btn:active {
  transform: scale(0.95);
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

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

/* Bottom Nav Styles */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 8px 10px 20px 10px; /* Extra padding for safe area on iPhone */
  box-shadow: 0 -4px 12px rgba(0,0,0,0.05); /* Softer shadow */
  z-index: 1000;
  border-top: 1px solid #f0f0f0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s;
  flex: 1; /* Distribute space evenly */
  max-width: 80px;
}

.nav-item .icon {
  font-size: 1.25rem;
  filter: grayscale(1);
  transition: filter 0.2s;
}

.nav-item.active {
  color: #42b983;
}

.nav-item.active .icon {
  filter: none;
  transform: scale(1.1);
}

.load-more-container {
  text-align: center;
  padding: 20px 0;
}

.load-more-btn {
  background: none;
  border: none;
  color: #42b983;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 20px;
  transition: background 0.2s;
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.load-more-btn:hover:not(:disabled) {
  background: #f0fdf4;
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .sticky-header {
    background-color: #242424;
    border-bottom-color: #333;
  }
  
  .filter-input {
    background: #333;
    border-color: #444;
    color: white;
  }
  
  .filter-input:focus {
    background: #2a2a2a;
  }

  .bottom-nav {
    background: #1a1a1a;
    border-top-color: #333;
  }

  .nav-item {
    color: #64748b;
  }
  
  .nav-item.active {
    color: #42b983;
  }
}
</style>
