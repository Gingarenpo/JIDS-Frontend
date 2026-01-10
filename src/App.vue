<script setup lang="ts">
import { getDataFromJWT, isMobile } from './helpers/helpers';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTokenStore } from './store';
import Toast from './components/common/Toast.vue';
import { registerToast } from './composables/useToast';


  const store = useTokenStore();
  const json = computed(() => getDataFromJWT(store.token));
  const route = useRoute(); // 現在のルートを取得

  console.log(json);

  // トーストバリュー
  const toast = ref();

  onMounted(() => {
    registerToast(toast.value);
  })

  // モバイル版用サイドバー開け閉め
  const side = ref(false);

  function openSide() {
    side.value = !side.value;
  }

  // 画面遷移が発生したら閉じる
  watch(() => route.fullPath, () => {
    side.value = false;
  })
</script>

<template>
  <div>
    <header>
      <h1><RouterLink to="/" class="no-link">JIDS</RouterLink></h1>
      <div class="sidebar" v-if="isMobile()" @click="openSide()">≡</div>
    </header>
    <div id="container">
      <main>
        <div class="error" v-if="json && json.legacy">
          <p>旧システムのパスワードを使用しています</p>
          <p>ログインユーザーは旧システムのパスワードを使用しています。<RouterLink to="/conpane/me">ここからパスワードを再度設定してください。</RouterLink>このメッセージは変更が完了するまでどのページでも表示されます。旧システムと「同じ文字列の」パスワードも使用可能なのでなるべく早く変更してください。</p>
        </div>
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
      </main>
      <div id="side" :class="{'open': side}">
        <Side/>
      </div>
    </div>
    <footer>
      <p>&copy; 2024-2026 Gingarenpo. All rights reserved.</p>
      <p v-if="json">ようこそ、<RouterLink to="/conpane">{{json.user_name}}</RouterLink>さん</p>
      <p v-else>情報提供者ですか？ <RouterLink to="/conpane">ログインしてください。</RouterLink></p>
    </footer>

    <Toast ref="toast"/>
  </div>

</template>

<style scoped>
</style>
