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
    if (to.name === 'login') {
        next();
        return;
    }

    const { user, isAllowed, awaitAuthReady } = useAuth();
    await awaitAuthReady();

    if (!user.value || !isAllowed.value) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router
