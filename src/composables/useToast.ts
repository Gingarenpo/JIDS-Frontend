// useToast.ts
import type { ComponentPublicInstance } from 'vue';

// Toastコンポーネントのインターフェースを定義
interface ToastInstance extends ComponentPublicInstance {
  show: (message: string, duration?: number) => void;
}

let toastRef: ToastInstance | null = null;

export function registerToast(instance: any) {
  toastRef = instance;
}

export function useToast() {
  return {
    show(message: string, duration?: number) {
      if (toastRef) {
        toastRef.show(message, duration);
      } else {
        console.warn("Toast instance is not registered.");
      }
    }
  };
}