import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/SettingsView.vue')
        },
        {
            path: '/add',
            name: 'add-media',
            component: () => import('../views/AddMediaView.vue')
        },
        {
            path: '/edit/:id',
            name: 'edit-media',
            component: () => import('../views/AddMediaView.vue')
        }
    ]
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    const { user, isAllowed, authLoading } = useAuth();

    // Wait for auth to initialize if it's currently loading
    // We can use a simple poll or a watch here, but since onAuthStateChanged 
    // fires immediately on load (or fairly quickly), we might need a promise wrapper if it's critical.
    // However, for simplicity in this turn, we'll assume the reactive state is sufficient or 
    // handle the "loading" state in the UI (App.vue) which is often better UX.
    // BUT, for a guard, we really want to know. 
    // Let's create a promise helper for the first load.

    if (to.name !== 'login') {
        // This is a bit tricky with the composable pattern above because `authLoading` is reactive.
        // We might need to wait multiple milliseconds. 
        // A better approach often involves a promise that resolves when auth is ready.
        // Let's modify useAuth slightly in the next step if this is flaky, 
        // but for now, let's rely on the fact that if user is null, we redirect.

        // Actually, if we refresh the page, `user` is null initially until firebase connects. 
        // So immediately redirecting to login on refresh is bad UX (flashes login).
        // I should fix useAuth to export a promise or handle this better.

        // RE-PLAN: checking the guard *inside* the router is standard. 
        // I will trust the user to be redirected if not logged in.
        // But I need to handle the "wait for auth" case. 

        // FOR NOW: Simple check. If this causes issues I will refactor to `getCurrentUser` promise.
    }

    // Changing approach slightly: use a promise-based check for the router guard
    // to avoid race conditions on page reload.
    const getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            const removeListener = auth.onAuthStateChanged(user => {
                removeListener();
                resolve(user);
            }, reject);
        });
    }

    if (to.name === 'login') {
        next();
        return;
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        next({ name: 'login' });
    } else {
        // User is logged in, check allowlist (this might be async too in the background)
        // Ideally we wait for the allowlist check too.
        // But `useAuth` handles the allowlist check asynchronously.
        // We can check the `isAllowed` ref, but it might not be ready yet.

        // Let's rely on App.vue to show a "Loading..." screen until authLoading is false.
        // That's a cleaner UX than hanging the router. 
        next();
    }
});

import { auth } from '../firebase'; // Import auth for the direct check in router

export default router
