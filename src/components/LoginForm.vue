<template>
  <div class="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-8 text-neutral-title">登录</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-neutral-title mb-2">用户名</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          autocomplete="username"
          class="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          placeholder="请输入用户名"
          required
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-neutral-title mb-2">密码</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          autocomplete="current-password"
          class="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          placeholder="请输入密码"
          required
        />
      </div>
      
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
      
      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  loading.value = true
  error.value = null
  
  try {
    await userStore.login(form.value.username, form.value.password)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: any) {
    error.value = userStore.error || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>
