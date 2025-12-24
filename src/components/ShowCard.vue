<template>
  <div class="show-card">
    <div class="poster-container">
      <img 
        v-if="item.poster_path" 
        :src="`https://image.tmdb.org/t/p/w154${item.poster_path}`" 
        :alt="item.name"
        class="poster"
      >
      <div v-else class="poster-placeholder">
        <span>No Poster</span>
      </div>
      
      <div class="type-icon" :title="item.type === 'movie' ? 'Movie' : 'TV Show'">
        <!-- Movie Icon -->
        <svg v-if="item.type === 'movie'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M19.5 4h-15A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0019.5 4zm-8.5 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM4 8h16v8H4V8z"/>
        </svg>
        <!-- TV Icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V8a2 2 0 00-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/>
        </svg>
      </div>

      <div v-if="currentTab === 'recommendations'" class="add-icon" @click.stop="$emit('add-to-watchlist', item)" title="Add to Watchlist">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div v-else class="edit-icon" @click.stop="$router.push(`/edit/${item.id}`)" title="Edit Show">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </div>
    </div>

    <div class="content">
      <h3 class="title">{{ item.name }}</h3>
      <p v-if="item.nickname" class="nickname">"{{ item.nickname }}"</p>
      <p class="service">{{ item.service }}</p>
      <p v-if="item.streamingService" class="streaming-service">{{ item.streamingService }}</p>
      <p class="synopsis">{{ truncate(item.synopsis, 80) }}</p>
      
      <p class="synopsis">{{ truncate(item.synopsis, 80) }}</p>
      
      <!-- Ratings Row (Hide on Recommendations) -->
      <div v-if="currentTab !== 'recommendations'" class="rating-row">
        <button 
          class="rating-btn love" 
          :class="{ active: item.rating === 'loved' }"
          @click.stop="$emit('update-rating', item, item.rating === 'loved' ? null : 'loved')"
          title="Love"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
        <button 
          class="rating-btn like" 
          :class="{ active: item.rating === 'liked' }"
          @click.stop="$emit('update-rating', item, item.rating === 'liked' ? null : 'liked')"
          title="Like"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
          </svg>
        </button>
        <button 
          class="rating-btn dislike" 
          :class="{ active: item.rating === 'disliked' }"
          @click.stop="$emit('update-rating', item, item.rating === 'disliked' ? null : 'disliked')"
          title="Dislike"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
          </svg>
        </button>
      </div>

      <div class="actions">
        <!-- Recommendations Layout -->
        <template v-if="currentTab === 'recommendations'">
           <div style="margin-bottom: 12px; text-align: center;">
            <a 
                v-if="tmdbUrl"
                :href="tmdbUrl" 
                target="_blank" 
                class="action-btn secondary"
                @click.stop
            >
                Learn More
            </a>
           </div>
           
           <div class="button-group">
               <button 
                class="action-btn"
                @click.stop="$emit('move-status', item, 'watched')"
               >
                Already Watched
               </button>
               <button 
                class="action-btn danger secondary"
                @click.stop="$emit('not-interested', item)"
               >
                Not Interested
               </button>
           </div>
        </template>

        <!-- Standard Layout -->
        <template v-else>
            <div v-if="false" style="margin-bottom: 8px;">
          <a 
            v-if="tmdbUrl"
            :href="tmdbUrl" 
            target="_blank" 
            class="action-btn secondary"
            @click.stop
          >
            Learn More
          </a>
        </div>
        <div v-if="showStartWatching">
          <button 
            v-if="!isUnreleased"
            @click="$emit('move-status', item, 'watching')"
            class="action-btn"
          >
            Start Watching
          </button>
          <div v-else class="unreleased-msg">
            Streaming {{ formattedReleaseDate }}
          </div>
        </div>
        <div v-if="showFinished" class="button-group">
          <button 
            @click="$emit('move-status', item, 'want_to_watch')"
            class="action-btn secondary"
            title="Return to Want to Watch"
          >
            Wait
          </button>
          <button 
            @click="$emit('move-status', item, 'watched')"
            class="action-btn"
          >
            Finished
          </button>
        </div>
        <div v-if="showWatchedActions" class="button-group">
          <button 
            @click="$emit('move-status', item, 'watching')"
            class="action-btn secondary"
            title="Move back to Watching"
          >
            Watching
          </button>
          <button 
            @click="$emit('move-status', item, 'want_to_watch')"
            class="action-btn secondary"
            title="Move back to Want to Watch"
          >
            Wait
          </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  currentTab: {
    type: String,
    default: ''
  }
});

defineEmits(['move-status', 'add-to-watchlist', 'update-rating', 'not-interested']);

const showStartWatching = computed(() => props.item.status === 'want_to_watch' || props.currentTab === 'want_to_watch');
const showFinished = computed(() => props.item.status === 'watching' || props.currentTab === 'watching');
const showWatchedActions = computed(() => props.item.status === 'watched' || props.currentTab === 'watched');

const isUnreleased = computed(() => {
  if (!props.item.release_date) return false;
  return new Date(props.item.release_date) > new Date();
});

const formattedReleaseDate = computed(() => {
  if (!props.item.release_date) return '';
  return new Date(props.item.release_date).toLocaleDateString();
});

const tmdbUrl = computed(() => {
  if (!props.item.tmdb_id) return '';
  const type = props.item.type === 'movie' ? 'movie' : 'tv';
  return `https://www.themoviedb.org/${type}/${props.item.tmdb_id}`;
});

const truncate = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

<style scoped>
.show-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  border: 1px solid #f0f0f0;
}

.show-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.poster-container {
  position: relative;
  width: 100px;
  flex-shrink: 0;
  background: #eee;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
  text-align: center;
  padding: 5px;
}

.type-icon {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.edit-icon {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-icon:hover {
  background: rgba(0, 0, 0, 0.9);
}

.add-icon {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: #42b983;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-icon:hover {
  background: #3aa876;
}

.icon {
  width: 100%;
  height: 100%;
}

.content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex child from overflowing */
}

.title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.nickname {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
  margin: 0 0 4px 0;
}

.service {
  color: #666;
  font-size: 0.85rem;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.streaming-service {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
  margin: 0 0 8px 0;
}

.rating-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  justify-content: center;
}

.rating-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #ccc;
  transition: color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-btn:hover {
  transform: scale(1.1);
}

.rating-btn svg {
  width: 24px;
  height: 24px;
}

.rating-btn.dislike:hover,
.rating-btn.dislike.active {
  color: #ef4444;
}

.rating-btn.like:hover,
.rating-btn.like.active {
  color: #3b82f6;
}

.rating-btn.love:hover,
.rating-btn.love.active {
  color: #ec4899;
}

.synopsis {
  font-size: 0.85rem;
  color: #555;
  margin: 0 0 12px 0;
  line-height: 1.4;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions {
  margin-top: auto;
}

.button-group {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 100%;
  padding: 8px 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
}

.action-btn:hover {
  background: #3aa876;
}

.action-btn.secondary {
  background: #e2e8f0;
  color: #475569;
}

.action-btn.secondary:hover {
  background: #cbd5e1;
}

.action-btn.danger {
    color: #ef4444;
    border-color: #ef4444;
}

.action-btn.danger:hover {
    background: #fee2e2;
}

.unreleased-msg {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}
</style>
