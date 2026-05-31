import { watch, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { TOKEN_KEY } from '@/config/constants'
import router from '@/router'

export function useCrossTabSync() {
  let syncHandler: ((event: StorageEvent) => void) | null = null

  function handleStorageChange(event: StorageEvent) {
    if (event.key !== TOKEN_KEY) return

    const userStore = useUserStore()

    if (!event.newValue && event.oldValue) {
      userStore.logout()
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    } else if (event.newValue && !event.oldValue) {
      userStore.initialize()
    }
  }

  onMounted(() => {
    syncHandler = handleStorageChange
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    if (syncHandler) {
      window.removeEventListener('storage', syncHandler)
      syncHandler = null
    }
  })
}
