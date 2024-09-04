<script lang="ts" setup>
    import IntersectionBox from '../components/IntersectionBox.vue';
    import axios from 'axios';
    import { onMounted, onUpdated, ref, watch } from 'vue';
    import { setHeader } from '../helpers/helpers';
    import { RouterLink, useRoute, useRouter } from 'vue-router';
    import Loading from '../components/common/Loading.vue';

    // 交差点情報を格納するRef
    const intersection = ref(null);

    // エリア情報を格納するRef
    const area = ref(null);

    // 現在表示しているdetailの内容を格納するRef
    const detail = ref(null);

    // 画像要素
    const S = ref([]);

    // ルーター情報
    const route = useRoute();
    const router = useRouter();

    // axiosを用いて交差点情報を取得
    axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/" + route.params.pref + "/" + route.params.area + "/" + route.params.intersection + "?withDetail=true")
    .then(response => {
        intersection.value = response.data;
        setHeader(`[${response.data.prefId}-${response.data.areaId}-${response.data.id}]「${response.data.name}」`, `「${response.data.name}」交差点の詳細情報を閲覧することができます。`);

        // デフォルトで一番最初のdetailを表示させる
        if (response.data.details.length > 0) {
            detail.value = response.data.details[0];
        }
    })
    .catch(e => {
        // 200以外だとこっちに来るらしい
        // 交差点情報が存在しない場合（404）
        if (e.response.status == 404) {
            // 交差点検索ページにリダイレクト
            router.push({ name: "Intersection" });
        }
    });

    axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/" + route.params.pref + "/" + route.params.area)
    .then(response => {
        area.value = response.data;
    });

    // takeDateをYYYY-MMDDにする関数を定義（computedにしないのはいろいろあって…）
    function formatDate(date:string):string {
        const d = new Date(date);
        return d.getFullYear() + '-' + ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2);
    }

    // detailが変更されたとき、中身のpicturesを全整形する
    watch(detail, () => {
        if (detail.value == null || !Array.isArray(detail.value.pictures)) return;
        // [SHMOA]で分解
        const pictures = {S: {}, H: {}, M: {}, O: {}, A: {}};
        for (const p of detail.value.pictures) {
            if (!pictures[p.type][p.number]) pictures[p.type][p.number] = [];
            pictures[p.type][p.number].push(p);
        }

        console.log(S);

        // それぞれのタイプにおいて、number > light(GYRXF) > subNumberの順番にする
        for (const key of Object.keys(pictures)) {
            const p = pictures[key];
            for (const number of Object.keys(p)) {
                p[number].sort((a, b) => {
                    if (a.number != b.number) return a.number - b.number;

                    // 銘板は一番最後
                    if (a.plate != b.plate) return a.plate ? 1 : -1;
                    
                    // lightのINDEXに変換
                    const lights = ["G", "Y", "R", "X", "F"];
                    const aLight = a.light == null ? -1 : lights.indexOf(a.light);
                    const bLight = b.light == null ? -1 : lights.indexOf(b.light);
                    if (aLight != bLight) return aLight - bLight;
                    if (a.subNumber != b.subNumber) return a.subNumber - b.subNumber;
                });
            }
            
        }
        detail.value.pictures = pictures;
    });

    // 画像の要素がクリックされたとき
    function clickImage(event, picture) {
        console.log(picture);
        let now = parseInt(event.target.closest("div").getAttribute("data-now"));
        const max = parseInt(event.target.closest("div").getAttribute("data-max"));
        if (now == max - 1) {
            now = 0;
        }
        else {
            now++;
        }
        event.target.closest("div").setAttribute("data-now", now);
        event.target.src = picture[now].url;
    }
</script>

<template>
    <Loading v-if="!intersection" message="交差点情報を取得しています…"/>
    <h2 v-if="intersection">[{{ intersection.prefId }}-{{ intersection.areaId }}-{{ intersection.id }}]{{ intersection.name }}</h2>
    <IntersectionBox v-if="intersection && area && intersection.status in {LIVE: true, GONE: true, MERGE: true}" :intersection="intersection" :area="area" />
    <div v-if="intersection && intersection.status == 'MOVE'">
        <p>この交差点は移管されました。<RouterLink :to="`/${intersection.prefId}/${intersection.areaId}`">エリアページに戻る</RouterLink></p>
    </div>
    <div v-if="intersection && intersection.details.length > 0">
        <div class="tabs">
            <div v-for="(d, i) in intersection.details" :class="{selected: d == detail}" @click="detail = intersection.details[i]">{{ formatDate(d.takeDate) }}</div>
        </div>
    </div>
    <div v-if="intersection && detail" class="tab-contents">
        <h3>車灯</h3>
        <div class="box">
            <div v-for="picture in detail.pictures.S" ref="S" :data-max="picture.length" :data-now="0">
                <h3>{{ picture[0].number }}</h3>
                <p>{{ console.log($event) }}</p>
                <img :src="picture[0].url" @click="clickImage($event, picture)" />
            </div>
        </div>
        <h3>歩灯</h3>
        <div class="box">
            <div v-for="picture in detail.pictures.H" :data-max="picture.length" :data-now="0">
                <h3>{{ picture[0].number }}</h3>
                <p>{{ console.log($event) }}</p>
                <img :src="picture[0].url" @click="clickImage($event, picture)" />
            </div>
        </div>
        <h3>制御機</h3>
        <div class="box">
            <div v-for="picture in detail.pictures.M" :data-max="picture.length" :data-now="0">
                <h3>{{ picture[0].number }}</h3>
                <p>{{ console.log($event) }}</p>
                <img :src="picture[0].url" @click="clickImage($event, picture)" />
            </div>
        </div>
        <h3>機械類</h3>
        <h3>その他</h3>
        <div class="box">
            <div v-for="picture in detail.pictures.O" :data-max="picture.length" :data-now="0">
                <h3>{{ picture[0].number }}</h3>
                <p>{{ console.log($event) }}</p>
                <img :src="picture[0].url" @click="clickImage($event, picture)" />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .tabs {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0 0.5rem;
        flex-wrap: wrap;
    }
    .tabs > div {
        background-color: white;
        border: 1px solid silver;
        border-bottom: none;
        border-radius: 0.5rem 0.5rem 0 0;
        padding: 0 1rem;
        font-size: 1.5rem;
        font-weight: 900;
        flex-basis: 20%;
        text-align: center;
        cursor: pointer;
    }
    .tabs > div:hover {
        background-color: var(--light-color);
    }
    .tabs > div.selected {
        background-color: var(--dark-color);
        color: white;
    }
    .tab-contents {
        border: 1px solid silver;
        margin: 0 0.5rem;
    }
    .box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .box > div {
        flex-basis: 33.3%;
    }
</style>