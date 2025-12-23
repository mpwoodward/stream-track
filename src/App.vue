<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { subscribeToMediaItems, unsubscribeFromMediaItems } from './services/mediaStore'
import { watch } from 'vue'
import logo from './assets/logo.svg'

// Notify user when update available
const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    console.log('SW Registered', r)
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

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Watch auth state to manage data subscription
watch([user, isAllowed], ([newUser, newAllowed]) => {
  if (newUser && newAllowed) {
    subscribeToMediaItems()
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
        <img :src="logo" alt="Stream Track" class="nav-logo" />
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/settings">Settings</RouterLink>
        </div>
        <div class="user-actions">
          <span class="user-email" v-if="user">{{ user.email }}</span>
          <button @click="handleLogout" class="logout-btn">LOGOUT</button>
        </div>
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
  align-items: center;
  gap: 1.5rem;
}

.nav-logo {
  height: 32px;
  width: 32px;
  object-fit: contain;
}

.user-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  font-size: 0.9rem;
  color: #666;
}

.nav-links a {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
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
</style>
