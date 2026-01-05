<script setup lang="ts">
import { getDataFromJWT } from './helpers/helpers';
import { computed, onMounted, ref, watch } from 'vue';
import { useTokenStore } from './store';
import Toast from './components/common/Toast.vue';
import { registerToast } from './composables/useToast';


  const store = useTokenStore();
  const json = computed(() => getDataFromJWT(store.token));

  // トーストバリュー
  const toast = ref();

  onMounted(() => {
    registerToast(toast);
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
  </div>

</template>

<style scoped>
</style>
