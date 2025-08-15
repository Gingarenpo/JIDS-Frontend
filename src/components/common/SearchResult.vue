<script lang="ts" setup>
import Loading from './Loading.vue';
import IntersectionBox from '../IntersectionBox.vue';
import SortFilterForm from './SortFilterForm.vue';
import { computed } from 'vue';

// 交差点一覧をpropsで渡す
const props = defineProps(['intersections', 'area', 'title']);

const intersections = computed(() => {
    return props.intersections;
})
</script>

<template>
    <div>
        <h2 v-if="props.area">【{{props.area.pref.name}}】{{props.area.name}}{{props.area.pref.manage == 'POLICE' ? '警察署' : ''}}</h2>
        <h2 v-if="props.title">検索結果: {{ props.title }}</h2>
        <Loading v-if="intersections.length == 0" message="交差点一覧を読み込んでいます…"/>
        <div  v-if="intersections.length > 0">
            <RouterLink :to="`/${area.pref.id}`"><p>都道府県ページに戻る</p></RouterLink>
            <h3>交差点一覧</h3>
            <p><span class="count">{{ intersections.length.toLocaleString() }}</span>交差点が見つかりました。</p>
            <SortFilterForm :model-value="intersections" @update:model-value="intersections = $event" />
            <IntersectionBox v-for="intersection in intersections" :intersection="intersection" :area="area"/>
            <RouterLink :to="`/${area.pref.id}`"><p>都道府県ページに戻る</p></RouterLink>
        </div>
    </div>
</template>

<style scoped>
    .count {
        font-size: 2rem;
        font-weight: 900;
    }
</style>