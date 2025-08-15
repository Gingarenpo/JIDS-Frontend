<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import { setHeader } from '../helpers/helpers';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import SearchResult from '../components/common/SearchResult.vue';


// ルーターパラメータを取得（こうしないとthisが使えない）
const route = useRoute();
const router = useRouter();


// 交差点一覧を格納する変数
const intersections = ref([]);

// エリア情報を格納する変数
const area = ref(null);

// axiosを用いて交差点一覧を取得
axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/" + route.params.pref + "/" + route.params.area + "?withIntersection=true&withDetail=true")
    .then(response => {
        // 交差点一覧とエリアを格納
        intersections.value = response.data.intersection;
        area.value = response.data;
        setHeader(
            `【${response.data.pref.name}】${response.data.name}${response.data.pref.manage == 'POLICE' ? '警察署' : ''}の交差点一覧`,
            `${response.data.pref.name}の${response.data.name}${response.data.pref.manage == 'POLICE' ? '警察署' : ''}管内にある交差点の情報を検索することができます。`
        );
    })
    .catch(error => {
        if (error.response.status == 404) {
            router.push({ name: "Pref" });
        }
    });

</script>

<template>
    <SearchResult :intersections="intersections" :area="area" />
</template>

<style scoped>

</style>