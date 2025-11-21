<template>
  <div class="login">
    <h1>Login</h1>
    <button @click="loginWithGoogle">Sign in with Google</button>
  </div>
</template>

<script setup>
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    router.push('/');
  } catch (error) {
    console.error("Error logging in: ", error);
    alert("Failed to log in: " + error.message);
  }
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
button {
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
