/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_MOCK_DELAY: string;
  readonly VITE_ENABLE_DEBUG_LOG: string;
  readonly VITE_PROXY_TARGET?: string;
  readonly VITE_CDN_URL?: string;
  readonly VITE_ENABLE_ERROR_MONITOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 全局变量声明
declare const __APP_VERSION__: string;
