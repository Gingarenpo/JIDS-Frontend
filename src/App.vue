<script setup lang="ts">
import { getDataFromJWT } from './helpers/helpers';
import { computed, ref, watch } from 'vue';
import { useTokenStore } from './store';

  const store = useTokenStore();
  const json = computed(() => getDataFromJWT(store.token));
</script>

<template>
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
    <p>&copy; 2024 Gingarenpo. All rights reserved.</p>
    <p v-if="json">ようこそ、<RouterLink to="/conpane">{{json.user_name}}</RouterLink>さん</p>
  </footer>
</template>

<style scoped>
</style>
