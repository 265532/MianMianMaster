import { ref, readonly, type Ref } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 1;

function show(
  message: string,
  type: ToastType = "info",
  duration = 3000,
): number {
  const id = nextId++;
  toasts.value.push({ id, type, message, duration });
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

function dismiss(id: number): void {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
}

function clear(): void {
  toasts.value = [];
}

export function useToast() {
  return {
    toasts: readonly(toasts) as Readonly<Ref<ToastItem[]>>,
    success: (message: string, duration?: number): number =>
      show(message, "success", duration),
    error: (message: string, duration?: number): number =>
      show(message, "error", duration ?? 4000),
    warning: (message: string, duration?: number): number =>
      show(message, "warning", duration),
    info: (message: string, duration?: number): number =>
      show(message, "info", duration),
    dismiss,
    clear,
  };
}
