import { ref } from 'vue';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const user = ref(null);
const isAllowed = ref(false);
const authLoading = ref(true); // Global loading state for auth check
const authError = ref(null);

// Initialize helper to keep state in sync
onAuthStateChanged(auth, async (currentUser) => {
    authLoading.value = true;
    user.value = currentUser;
    authError.value = null;

    if (currentUser) {
        try {
            // Check allowlist
            // We expect a document in 'allowed_users' collection with ID == user.email
            const docRef = doc(db, 'allowed_users', currentUser.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                isAllowed.value = true;
            } else {
                isAllowed.value = false;
                authError.value = "User not in allowlist";
            }
        } catch (e) {
            console.error("Error checking allowlist:", e);
            authError.value = "Error verifying user permissions";
            isAllowed.value = false;
        }
    } else {
        isAllowed.value = false;
    }
    authLoading.value = false;
});

export function useAuth() {

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            authError.value = null;
            await signInWithPopup(auth, provider);
            // State updates are handled by onAuthStateChanged
        } catch (error) {
            console.error("Login error:", error);
            authError.value = error.message;
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // State updates are handled by onAuthStateChanged
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    return {
        user,
        isAllowed,
        authLoading,
        authError,
        login,
        logout
    };
}
