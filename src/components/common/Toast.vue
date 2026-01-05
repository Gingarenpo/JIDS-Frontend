<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
let timer: number | null = null;

function show(msg: string, duration = 3000) {
  message.value = msg;
  visible.value = true;

  console.log("visible is now:", visible.value);

  if (timer !== null) {
    clearTimeout(timer);
  }

  timer = window.setTimeout(() => {
    visible.value = false;
  }, duration);
}

defineExpose({ show });
</script>

<template>
  <transition name="toast">
    <div v-if="visible" class="toast">
        {{ message }}
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 2rem;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-size: 0.9rem;
  z-index: 9999;
}

/* アニメーション */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
