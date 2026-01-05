<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import BackConpane from '../../components/common/BackConpane.vue';
import { ref } from 'vue';
import { axiosWithJWTToken, setHeader } from '../../helpers/helpers';
import Loading from '../../components/common/Loading.vue';
import BackPrevPage from '../../components/common/BackPrevPage.vue';

// ルーター
const route = useRoute();

// キューの内容
const contents = ref(null);

// キューの状態
const status = ref("-");

// axiosを用いてキュー情報を取得
axiosWithJWTToken("get", import.meta.env.PUBLIC_SERVER_ROOT + "/queues/" + route.params.id)
.then((response) => {
    if (response.status == 200) {
        contents.value = response.data;

        if (contents.value.acceptDate == null && contents.deniedDate == null) {
            status.value = "審査待ち";
        }
        else if (contents.value.acceptDate != null) {
            status.value = "承認済み";
        }
        else {
            status.value = "拒否済み";
        }
    }
    else {
        contents.value = -1;
    }
})

// サムネイルURL取得用
function getThumbnailUrl(url) {
    return import.meta.env.PUBLIC_SERVER_ROOT + url;
}




</script>

<template>
    <div>
        <h2>キューID: {{ route.params.id }}</h2>
        <Loading message="キューの内容を問い合わせています……" timeout="10000" v-if="contents == null"></Loading>
        <div v-if="contents == -1" class="error">
            <p>キューの読み込みに失敗しました</p>
            <p>指定されたキューIDは、以下のどれかの原因により詳細を表示することができません。</p>
            <ul>
                <li>指定されたキューを参照する権限がありません。キューを参照できるのは、キューをアップロードしたユーザーか、最高管理者のみとなっています。</li>
                <li>指定されたキューは存在しません。キューIDが間違っていませんか？</li>
                <li>指定されたキューの登録情報が異常です。上記を確かめてもどうにも表示されない場合は最高管理者にお問い合わせください。</li>
            </ul>
        </div>
        <div v-if="contents != null && contents !== -1">
            <p v-if="contents.thumbnails.length > 0 && contents.details.length > 0">キュー内には<em>{{ contents.thumbnails.length }}</em>件のサムネイルと、<em>{{ contents.details.length }}</em>件の現地調査データがあります。</p>
            <p v-else-if="contents.thumbnails.length > 0">キュー内には<em>{{ contents.thumbnails.length }}</em>件のサムネイルがあります。</p>
            <p v-else-if="contents.details.length > 0">キュー内には<em>{{ contents.details.length }}</em>件の現地調査データがあります。</p>
            <p>このキューは<b>{{ contents.userId }}</b>によるアップロードです。このキューの状態は、<em>{{ status }}</em>です。</p>

            <BackPrevPage />

            <div v-if="contents.thumbnails.length > 0">
                <h3>サムネイル一覧</h3>
                <div class="flex">
                    <div v-for="thumbnail in contents.thumbnails" :key="thumbnail.id" class="box" :class="thumbnail.result ? 'accept' : 'reject'">
                        <h4><a :href="'/' + thumbnail.intersection.prefId + '/' + thumbnail.intersection.areaId + '/' + thumbnail.intersection.id" target="_blank">{{ thumbnail.prefId }} - {{ thumbnail.areaId }} - {{ thumbnail.intersectionId}}: {{ thumbnail.intersection.name }}</a></h4>
                        <Loading v-if="thumbnail.loadError === false" message="サムネイルを読み込んでいます…"></Loading>
                        <img v-if="!thumbnail.loadError" :src="getThumbnailUrl(thumbnail.url)" @error="thumbnail.loadError = true;" />
                        <p v-else>※キューの保存期間満了に伴い画像は削除されました。承認された場合は該当交差点のサムネイルからご確認できます。</p>
                        <p>このサムネイルは<em>{{ thumbnail.result ? "承認" : "拒否" }}</em>されました。<span v-if="!thumbnail.result">→{{ thumbnail.comment }}</span></p>
                    </div>
                </div>
            </div>

            <div v-if="contents.details.length > 0">
                <h3>現地調査一覧</h3>
                <p>※現地調査データは画像の量が膨大なため、リストアップのみとしています</p>
                <div class="flex">
                    <div class="box" v-for="detail in contents.details" :key="detail.id">
                        <a :href="'/' + detail.intersection.prefId + '/' + detail.intersection.areaId + '/' + detail.intersection.id" target="_blank">
                            <h4>{{ detail.prefId }} - {{ detail.areaId }} - {{ detail.intersectionId}}: {{ detail.intersection.name }}</h4>
                        </a>
                        <p>登録枚数: <em>{{ detail.pictures.length }}</em>枚</p>
                    </div>
                </div>
            </div>
        </div>

        <BackPrevPage />
    </div>
</template>

<style scoped>
    .flex > div {
        flex-basis: 33%;
    }

    .flex {
        display: flex;
        flex-wrap: wrap;
    }

    .accept {
        background-color: var(--accept-color) !important;
    }

    .reject {
        background-color: var(--reject-color) !important;
    }
</style>