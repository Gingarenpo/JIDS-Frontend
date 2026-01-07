<script setup lang="ts">
import { getDataFromJWT } from './helpers/helpers';
import { computed, onMounted, ref, watch } from 'vue';
import { useSessionStore, useTokenStore } from './store';
import Toast from './components/common/Toast.vue';
import { registerToast } from './composables/useToast';
import { useSessionWatcher } from './composables/useSessionWatcher';
import Dialog from './components/common/Dialog.vue';


  const store = useTokenStore();
  const sessionStore = useSessionStore();
  const json = computed(() => getDataFromJWT(store.token));

  // セッション監視を行うコンポーザブル
  useSessionWatcher(30000); // 30秒ごとに監視

  // トーストバリュー
  const toast = ref();

  onMounted(() => {
    registerToast(toast.value);
  })
</script>

<template>
  <div>
    <header>
      <h1><RouterLink to="/" class="no-link">JIDS</RouterLink></h1>
    </header>
    <div id="container">
      <main>
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
      </main>
      <div id="side">
        <Side/>
      </div>
    </div>
    <footer>
      <p>&copy; 2024-2025 Gingarenpo. All rights reserved.</p>
      <p v-if="json">ようこそ、<RouterLink to="/conpane">{{json.user_name}}</RouterLink>さん</p>
      <p v-else>情報提供者ですか？ <RouterLink to="/conpane">ログインしてください。</RouterLink></p>
    </footer>

    <Toast ref="toast"/>

    <Dialog v-if="sessionStore.expired" title="セッション切れ" type="error">
      <p>サーバーの再起動やブラウザの環境設定が原因でセッションが切れてしまいました。お手数ですが再度ログインをお願いします。</p>
      <RouterLink to="/conpane/login"><button @click="sessionStore.reset();">ログインする</button></RouterLink>
    </Dialog>
  </div>

</template>

<style scoped>
</style>
