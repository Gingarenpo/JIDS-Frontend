<script lang="ts" setup>
    import { setHeader } from '../helpers/helpers';
    import {ref, onMounted, nextTick, computed} from 'vue';
    import anime from 'animejs';
    import axios from 'axios';
import Loading from '../components/common/Loading.vue';

    setHeader(undefined, "JIDSは、日本全国の交差点を検索することができるサイトです。このサイトは、皆様の情報提供により支えられています。", "JIDS,交差点,信号機,検索,交通信号機");

    // メタ情報（初期値は動作確認用です）
    const intersections = ref(0);
    const thumbnails = ref(0);
    const details = ref(0);
    const sinceYear = ref(0);
    const users = ref(0);
    const datas = ref(0);

    // 完了フラグ
    const done = ref(false);

    // バーチャートレース
    const bcrThumbnail = computed(() => {
        return import.meta.env.PUBLIC_SERVER_ROOT + "/static/thumbnail.gif";
    });
    const bcrDetail = computed(() => {
        return import.meta.env.PUBLIC_SERVER_ROOT + "/static/detail.gif";
    });


    // axiosを用いてメタ情報を取得
    axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/metas")
    .then(response => {
        intersections.value = response.data.intersectionCount;
        thumbnails.value = response.data.thumbnailCount;
        details.value = response.data.detailCount;
        sinceYear.value = 2019;
        users.value = response.data.userCount;
        datas.value = response.data.pictureCount;
        done.value = true;
        
        nextTick(() => {
            countUp();
        });
    })
    .catch(error => {
        console.error(error);
    });

    function countUp() {
        const counters = document.querySelectorAll(".count");
        counters.forEach(counter => {
            anime({
                targets: counter,
                innerHTML: [0, counter.getAttribute("data-count")],
                easing: "easeInOutQuad",
                round: 1,
                duration: 1000,
                update: () => {
                    counter.innerHTML = parseInt(counter.innerHTML).toLocaleString();
                }
            });
        });
    }
    
</script>

<template>
    <h2>Welcome to JIDS!</h2>
    <p>JIDSは、日本全国の交差点情報を管理・検索することができるシステムです。交差点情報は皆さまの情報提供によって拡充されます。</p>
    <p>信号機ファンが信号機ファンのために用意したシステムですが、勿論信号機ファンでなくても役に立つ場面はあるかもしれません。</p>
    <p>システムに関する詳しい説明は<RouterLink to="/about">こちら</RouterLink>からご覧いただけます。</p>

    <h3>数値で見るJIDS</h3>
    <div class="bcr">
        <img :src="bcrThumbnail">
        <img :src="bcrDetail">
    </div>
    <Loading v-if="!done" message="メタ情報を取得中です…"/>
    <div id="meta" class="box" v-if="done">
        <div>
            <i class="fa-solid fa-traffic-light"></i>
            <div>
                <p>全国の交差点を探せます</p>
                <p>現在、<span class="count" :data-count="intersections">{{ intersections }}</span>交差点の<br>交差点情報が登録されています。</p> 
            </div>
        </div>
        <div>
            <i class="fa-solid fa-image"></i>
            <div>
                <p>実際に写真も掲載しています</p>
                <p>現在、<span class="count" :data-count="thumbnails">{{ thumbnails }}</span>交差点の<br>サムネイルが登録されています。</p> 
            </div>
        </div>
        <div>
            <i class="fa-solid fa-camera"></i>
            <div>
                <p>交差点の様子も見ることができます</p>
                <p>現在、<span class="count" :data-count="details">{{ details }}</span>交差点の<br>現地調査情報が登録されています。</p> 
            </div>
        </div>
        <div>
            <i class="fa-solid fa-calendar-check"></i>
            <div>
                <p>何気に長続きしています</p>
                <p><span class="count" :data-count="sinceYear">{{ sinceYear }}</span>年にプロジェクトが開始しました。</p> 
            </div>
        </div>
        <div>
            <i class="fa-solid fa-user"></i>
            <div>
                <p>たくさんの方々にお世話になっております</p>
                <p><span class="count" :data-count="users">{{ users }}</span>人の方に情報提供を頂きました。</p> 
            </div>
        </div>
        <div>
            <i class="fa-solid fa-database"></i>
            <div>
                <p>割と多いほうではないでしょうか</p>
                <p><span class="count" :data-count="datas">{{ datas }}</span>枚の画像を管理しています。</p> 
            </div>
        </div>
    </div>

    <h3>あなたの力を必要としています</h3>
    <p>このシステムは情報提供、システム保守・開発協力を積極的に受け付けております。規模が大きくなるにつれて個人での管理がかなり厳しくなってきているので、協力したい！という方はお気軽に参加してください！</p>

    <div id="links" class="box">
        <a href="https://github.com/gingarenpo/JIDS-Frontend" target="_blank" class="no-link">
            <div>
                <i class="fa-brands fa-github"></i>
                <div>
                    <p>JIDSの開発に協力していただける方</p>
                    <p>ソースコードはGitHubにて公開しています。<br>NodeJSを使用して構築されています。</p> 
                </div>
            </div>
        </a>

        <RouterLink to="/conpane" class="no-link">
            <div>
                <i class="fa-solid fa-gear"></i>
                <div>
                    <p>情報提供をしていただける方</p>
                    <p>各種操作ができるコントロールパネルを用意しています。</p>
                    <p>このボックスをクリックするか、メニューから「コントロールパネル」をクリックすると遷移します。</p> 
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<style scoped>
    .box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: calc(100% - 1rem);
        margin: 0.5rem;
        flex-wrap: wrap;
    }

    .box > div, .box > a > div, .box > Routerlink > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid gray;
        background-color: white;
        margin: 0.5rem;
        padding: 0.25rem;
        flex-basis: 31%;
    }

    .box > a {
        flex-basis: 31%;
        margin: 0.5rem;
        padding: 0.25rem;
    }

    .box div i {
        font-size: 4rem;
        width: 4rem;
        text-align: center;
        margin: 0 0.5rem;
    }

    .box div div > p:first-child {
        font-weight: bold;
        border-bottom: 2px solid black;
    }

    .box > div div span.count {
        font-size: 3rem;
        font-weight: 900;
    }

    .bcr {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-around;
        margin: 0.5rem;
    }

    .bcr img {
        display: block;
        max-width: 100%;
        flex-basis: 45%;
        min-width: 0;
    }

    @media screen and (max-width: 800px) {
        .box > div {
            flex-basis: 100%;
        }
    }
</style>