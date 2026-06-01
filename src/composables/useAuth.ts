import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { isLoggedIn as checkTokenExists } from "@/utils/auth";
import { useRouter } from "vue-router";

export function useAuth() {
  const userStore = useUserStore();
  const router = useRouter();

  const isAuthenticated = computed(() => userStore.isLoggedIn);
  const currentUser = computed(() => userStore.user);
  const isAdmin = computed(() => userStore.user.role === "admin");

  function requireAuth(): boolean {
    if (!checkTokenExists()) {
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
      return false;
    }
    return true;
  }

  function requireAdmin(): boolean {
    if (!requireAuth()) return false;
    if (!isAdmin.value) {
      router.push("/");
      return false;
    }
    return true;
  }

  async function login(username: string, password: string) {
    return userStore.login(username, password);
  }

  function logout() {
    userStore.logout();
    router.push("/login");
  }

  return {
    isAuthenticated,
    currentUser,
    isAdmin,
    requireAuth,
    requireAdmin,
    login,
    logout,
  };
}
