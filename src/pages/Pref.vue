<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import { setHeader } from '../helpers/helpers';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Loading from '../components/common/Loading.vue';
import AreaBox from '../components/AreaBox.vue';
import Map from '../components/common/Map.vue';

// ルーターパラメータを取得（こうしないとthisが使えない）
const route = useRoute();
const router = useRouter();

// 都道府県情報（初期値適当）
const pref = ref(null);

// エリア情報
const areas = ref([]);

// 交差点一覧（マップ表示用）
let intersections = [];

// 完了フラグ
const done = ref(false);

// axiosを用いて都道府県情報を取得
axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/"+ route.params.pref + "?withArea=true")
    .then(response => {
        // 都道府県情報を入れる
        pref.value = response.data;
        // エリア情報を入れる
        areas.value = response.data.area;

        // ヘッダーを設定
        setHeader(response.data.name, "日本全国の信号機に関する情報を、交差点から探すことができます。", "交差点,信号機,検索,交通信号機");
    })
    .catch(e => {
        // 200以外だとこっちに来るらしい
        // 都道府県情報が存在しない場合（404）
        if (e.response.status == 404) {
            // 都道府県検索ページにリダイレクト
            router.push({ name: "Pref" });
        }
    });

// 全交差点情報も取得（カウンターだけではなく）
// 通信量増えるのでできれば避けたい
axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/" + route.params.pref + "?withArea=true&withIntersection=true&withDetail=true")
    .then(response => {
        // 交差点情報を入れる
        intersections = response.data.area.map(area => {
            return area.intersection.map(intersection => {
                return {
                    ...intersection,
                    area: area
                }
            });
        }).flat(1);
        done.value = true;
    })

</script>

<template>
    <Loading v-if="!pref" message="都道府県情報を読み込んでいます……"/>
    <div class="meta" v-if="pref && areas.length > 0">
        <h2>{{ pref.name }}</h2>
        <p>{{ pref.name }}の交差点情報を検索することができます。</p>

        <h3>地図から探す</h3>
        <Loading v-if="!done" message="地図の読み込みを行っています…"></Loading>
        <Map :intersections="intersections" :pref="pref" v-if="done"></Map>

        <h3>エリアから探す</h3>
        <AreaBox v-for="area in areas" :area="area" :pref="pref" />

        <RouterLink :to="`/${pref.id}`" v-if="pref">都道府県一覧に戻る</RouterLink>
    </div>
    <div class="meta" v-if="pref && areas.length == 0">
        <h2>Not Available</h2>
        <p>大変申し訳ございません。{{ pref.name }}の情報は現在閲覧することができません。これには、以下の原因が考えられます。</p>
        <ul>
            <li>交差点管理方式が不明なため、データベースの整備ができません。</li>
            <li>エリア情報の整備を行っています。</li>
            <li>何らかのデータの不整合により一時的に正しい情報が表示されなくなっています。</li>
        </ul>
        <p>{{ pref.name }}の情報について何かお分かりのことなどある場合は、お手数をおかけしますが最高管理者までご連絡いただければ幸いです。</p>
    </div>
    <RouterLink :to="`/${pref.id}`" v-if="pref">都道府県一覧に戻る</RouterLink>
</template>

<style scoped></style>