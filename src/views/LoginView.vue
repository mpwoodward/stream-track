<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <img :src="logo" alt="Stream Track Logo" class="app-logo" />
        <h2 class="app-title">Stream Track</h2>
      </div>
      <h1>Welcome Back</h1>
      <p class="subtitle">Please sign in to access Stream Track</p>
      
      <div v-if="authError" class="error-message">
        {{ authError }}
      </div>

      <div v-if="user && isAllowed" class="success-state">
        <p>You are logged in!</p>
        <button @click="router.push('/')" class="google-btn">Go to Home</button>
      </div>

      <button v-else @click="handleLogin" :disabled="isLoggingIn" class="google-btn">
        <span v-if="isLoggingIn">Signing in...</span>
        <span v-else>Sign in with Google</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import logo from '../assets/logo.svg';

const router = useRouter();
const { login, logout, user, isAllowed, authError } = useAuth();
const isLoggingIn = ref(false);

const handleLogout = async () => {
  await logout();
  isLoggingIn.value = false;
};

const handleLogin = async () => {
  isLoggingIn.value = true;
  try {
    if (user.value) {
      await logout();
    }
    await login();
    // Watcher below will handle redirection once user & allowlist are verified
  } catch (e) {
    isLoggingIn.value = false;
    // Error is already set in authError by the composable, but we can log it
    console.error(e);
  }
};

// Watch for successful auth and allowlist verification
watch([user, isAllowed], ([newUser, newAllowed]) => {
  if (newUser && newAllowed) {
    console.log("User allowed, redirecting to home...");
    router.push('/');
  }
}, { immediate: true });
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #242424;
}

.login-card {
  background: #1a1a1a;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid #333;
}


.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.app-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.app-title {
  color: #42b983;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

h1 {
  margin-bottom: 0.5rem;
  color: #fff;
}

.subtitle {
  color: #aaa;
  margin-bottom: 2rem;
}

.error-message {
  background-color: rgba(220, 38, 38, 0.2);
  color: #f87171;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  border: 1px solid #dc2626;
}

.success-state p {
  color: #fff;
  margin-bottom: 1rem;
}

.denied-state p.error-text {
  color: #f87171;
  font-weight: bold;
}

.denied-state p.subtitle {
  color: #888;
}

.google-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.google-btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #2a7a56;
}

.logout-btn-center {
  background-color: transparent;
  color: #aaa;
  border: 1px solid #444;
  margin-top: 1rem;
}

.logout-btn-center:hover {
  background-color: #333;
  color: #fff;
  border-color: #666;
}
</style>
