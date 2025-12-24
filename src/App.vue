<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { subscribeToMediaItems, unsubscribeFromMediaItems, subscribeToIgnoredItems } from './services/mediaStore'
import { watch, computed } from 'vue'
import logo from './assets/logo.svg'

// Notify user when update available
const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    console.log('SW Registered', r);
    r.update(); // Initial check
    setInterval(async () => {
      console.log('Checking for updates...');
      await r.update();
    }, 60 * 60 * 1000); // Check every hour
  },
  onRegisterError(err) {
    console.log('SW Register Error', err)
  },
})

const close = () => {
  needRefresh.value = false
}

const { user, logout, authLoading, isAllowed } = useAuth()

const router = useRouter()
const route = useRoute()

const tabs = [
  { id: 'watching', label: 'Watching', icon: '📺' },
  { id: 'want_to_watch', label: 'To Watch', icon: '🔖' },
  { id: 'watched', label: 'Watched', icon: '✅' },
  { id: 'recommendations', label: 'For You', icon: '✨' }
]

const currentTab = computed(() => {
  if (route.path !== '/') return null
  return route.query.tab || 'watching'
})

const navigateToTab = (tabId) => {
  router.push({ path: '/', query: { tab: tabId } })
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Watch auth state to manage data subscription
watch([user, isAllowed], ([newUser, newAllowed]) => {
  if (newUser && newAllowed) {
    subscribeToMediaItems()
    subscribeToIgnoredItems()
  } else {
    unsubscribeFromMediaItems()
  }
}, { immediate: true })

// Security: If authentication handles loading and determines user is NOT allowed,
// force them back to the login screen (if they aren't already there).
watch([authLoading, user, isAllowed], ([loading, currentUser, allowed]) => {
  if (!loading && currentUser && !allowed) {
    // Check if we are not already on login page to avoid redundant pushes
    if (router.currentRoute.value.name !== 'login') {
       router.push('/login')
    }
  }
})
</script>

<template>
  <div v-if="authLoading" class="loading-screen">
    Loading...
  </div>
  
  <template v-else>
    <header v-if="user && isAllowed">
      <nav>
        <div class="brand">
          <img :src="logo" alt="Stream Track" class="nav-logo" />
          <span class="app-title">StreamTrack</span>
        </div>
        <button @click="handleLogout" class="logout-btn">LOGOUT</button>
      </nav>
    </header>

    <RouterView />

    <div v-if="needRefresh" class="pwa-toast" role="alert">
      <div class="message">
        New content available, click on reload button to update.
      </div>
      <button @click="updateServiceWorker()" class="reload-btn">
        Reload
      </button>
      <button @click="close" class="close-btn">
        Close
      </button>
    </div>

    <!-- Bottom Navigation -->
    <nav v-if="user && isAllowed" class="bottom-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="nav-item"
        :class="{ active: currentTab === tab.id }"
        @click="navigateToTab(tab.id)"
      >
        <span class="icon">{{ tab.icon }}</span>
        <span class="label">{{ tab.label }}</span>
      </button>
    </nav>
  </template>
</template>

<style scoped>
header {
  line-height: 1.5;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

nav {
  width: 100%;
  display: flex;
  justify-content: space-between; /* Push items to edges */
  gap: 1.5rem; /* Fallback */
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-title {
  color: #42b983;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: -0.5px;
}

.nav-logo {
  height: 32px;
  width: 32px;
  object-fit: contain;
}

.logout-btn {
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #dc2626;
  color: white;
}

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
}

.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 100;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: white;
  display: flex;
  gap: 10px;
  align-items: center;
}

.pwa-toast .message {
  margin-bottom: 0;
  color: #333;
}

.reload-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn {
  background-color: transparent;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
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

@media (prefers-color-scheme: dark) {
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
