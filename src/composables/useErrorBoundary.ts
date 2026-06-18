import { onErrorCaptured } from "vue";

interface ErrorCaptureOptions {
  handler?: (err: unknown, instance: any, info: string) => void;
}

export function useErrorBoundary(options?: ErrorCaptureOptions) {
  const defaultHandler = (err: unknown, _instance: any, info: string) => {
    console.error("[ErrorBoundary] Captured error:", err);
    console.error("[ErrorBoundary] Error info:", info);
  };

  onErrorCaptured((err, instance, info) => {
    const handler = options?.handler || defaultHandler;
    handler(err, instance, info);
    return false;
  });
}
