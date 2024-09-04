<script setup lang="ts">

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
  </footer>
</template>

<style scoped>
</style>
