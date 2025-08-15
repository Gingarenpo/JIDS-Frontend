<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import BackConpane from '../../components/common/BackConpane.vue';
import { ref } from 'vue';
import { axiosWithJWTToken } from '../../helpers/helpers';
import Loading from '../../components/common/Loading.vue';

// ルーター
const route = useRoute();

// キューの内容
const contents = ref(null);

// axiosを用いてキュー情報を取得
axiosWithJWTToken("get", import.meta.env.PUBLIC_SERVER_ROOT + "/queues/" + route.params.id)
.then((response) => {
    if (response.status == 200) {
        contents.value = response.data;
    }
    else {
        contents.value = -1;
    }
});


</script>

<template>
    <h2>キューID: {{ route.params.id }}</h2>
    <Loading message="キューの内容を問い合わせています……" timeout="10000" v-if="contents == null"></Loading>
    <div v-if="contents != null && contents == -1" class="error">
        <p>キューの読み込みに失敗しました</p>
        <p>指定されたキューIDは、以下のどれかの原因により詳細を表示することができません。</p>
        <ul>
            <li>指定されたキューIDがそもそも登録されていません。IDを打ち間違えていませんか？</li>
            <li>指定されたキューIDは、あなたが詳細を閲覧する権利を持っていません。あなたがアップロードしたキューですか？　もしくはあなたは最高管理者ですか？</li>
            <li>指定されたキューIDは記録としては残っているものの、内部のデータが既に削除されています。これは、そのキューが拒否され一定期間経過したのちに発生することがあります。</li>
            <li>指定されたキューの登録状況に異常があります。上記に該当しない場合はこちらを疑い頂き、最高管理者へご連絡ください。</li>
        </ul>
    </div>
    <div v-if="contents != null">
        <p>キュー内には</p>
    </div>
</template>

<style scoped>
</style>