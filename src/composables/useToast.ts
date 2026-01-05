
import type { ComponentPublicInstance } from 'vue';

let toastRef: ComponentPublicInstance | null = null;

export function registerToast(ref: ComponentPublicInstance) {
  toastRef = ref;
}

export function useToast() {
  return {
    show(message: string, duration?: number) {
      toastRef?.exposed?.show(message, duration);
    }
  };
}
