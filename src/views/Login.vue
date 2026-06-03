<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";

const router = useRouter();
const route = useRoute();

function handleLoginSuccess(): void {
  const redirect = (route.query.redirect as string) || "/";
  router.push(redirect);
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-neutral-bg">
    <div class="w-[500px] max-w-md">
      <LoginForm @success="handleLoginSuccess" @cancel="router.push('/')" />
    </div>
  </div>
</template>
