import { ref } from "vue";

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useRequest<T>() {
  const state = ref<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  async function execute(
    requestFn: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
    },
  ): Promise<T | null> {
    state.value.loading = true;
    state.value.error = null;

    try {
      const result = await requestFn();
      state.value.data = result;
      options?.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "请求失败";
      state.value.error = errorMessage;
      options?.onError?.(errorMessage);
      return null;
    } finally {
      state.value.loading = false;
    }
  }

  function reset(): void {
    state.value = {
      data: null,
      loading: false,
      error: null,
    };
  }

  return {
    state,
    execute,
    reset,
  };
}
