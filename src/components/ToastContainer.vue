<script setup lang="ts">
import { useToast, type ToastType } from "@/composables/useToast";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-vue-next";

const { toasts, dismiss } = useToast();

const iconMap: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<ToastType, string> = {
  success: "bg-green-50/95 border-green-200 text-green-900",
  error: "bg-red-50/95 border-red-200 text-red-900",
  warning: "bg-amber-50/95 border-amber-200 text-amber-900",
  info: "bg-blue-50/95 border-blue-200 text-blue-900",
};

const iconColorMap: Record<ToastType, string> = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100vw-3rem)] sm:w-auto pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 p-4 pr-10 rounded-2xl border shadow-lg backdrop-blur-sm relative',
            colorMap[toast.type],
          ]"
          role="alert"
        >
          <component
            :is="iconMap[toast.type]"
            :size="20"
            :class="['flex-shrink-0 mt-0.5', iconColorMap[toast.type]]"
          />
          <p class="text-sm font-medium flex-1 break-words leading-relaxed">
            {{ toast.message }}
          </p>
          <button
            type="button"
            class="absolute top-3 right-3 p-0.5 opacity-50 hover:opacity-100 transition-opacity rounded"
            aria-label="关闭通知"
            @click="dismiss(toast.id)"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(120%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(120%);
}
.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
