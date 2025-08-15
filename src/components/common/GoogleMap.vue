<script setup lang="ts">
import { computed } from 'vue';

    // 交差点情報を受け取り、GoogleMapにマーカーを表示する
    const props = defineProps({
        intersection: Object,
    });

    // URL
    const url = computed(() => {
        return "https://maps.google.co.jp/maps?output=embed&q=" + props.intersection.location.y + "," + props.intersection.location.x + "&z=17";
    })
</script>

<template>
    <div>
        <iframe :src="url"></iframe>
    </div>
</template>

<style scoped>
    iframe {
        width: calc(100% - 1rem);
        height: 20vh;
        margin: 0.5rem;
    }
</style>