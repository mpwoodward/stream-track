<template>
  <div class="login-container">
    <div class="login-card">
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
  background-color: #f0f2f5;
}

.login-card {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

h1 {
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.google-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.google-btn:hover:not(:disabled) {
  background-color: #357abd;
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.logout-btn-center {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  margin-top: 1rem;
}

.logout-btn-center:hover {
  background-color: #f5f5f5;
  color: #333;
}
</style>
