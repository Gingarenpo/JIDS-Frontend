<script lang="ts" setup>
    import { ref } from 'vue';
import Map from '../components/common/Map.vue';
import axios from 'axios';
    
    const pref = ref(null);
    const intersection = ref(null);

    // TODO: クエリ最適化する
    /*axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/?withArea=true&withIntersection=true&withDetail=true")
        .then(response => {
            console.log(response.data);
        })*/
</script>

<template>
    <h2>地図から探す</h2>
    <p>クエリが最適化されていないため現在未対応。都道府県ページから探してください。</p>
</template>

<style scoped></style>