<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { subscribeToMediaItems, unsubscribeFromMediaItems } from './services/mediaStore'
import { watch } from 'vue'

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
  justify-content: space-between;
  align-items: center;
}

.user-actions {
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
</style>
