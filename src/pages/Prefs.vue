<script lang="ts" setup>
    // axiosを用いて都道府県情報を取得
    import {ref, onMounted} from 'vue';
    import axios from 'axios'
    import PrefBox from '../components/PrefBox.vue';
    import {setHeader} from '../helpers/helpers';

    // ヘッダーを設定
    setHeader("都道府県から探す", "日本全国の信号機に関する情報を、都道府県から探すことができます。", "都道府県,交差点,信号機,検索,交通信号機");

    // Loadingアイコンの存在可否を決定するフラグ
    const done = ref(false);

    // 都道府県一覧を表示するためのコンポーネントリスト
    const prefList = ref([]);

    onMounted(() => {
        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/")
        .then(response => {
            // Loadingの中身を変更
            prefList.value = response.data;

            // 終了：doneフラグ入れる
            done.value = true;
        })
        .catch(error => {
            console.error(error);
        });
    })
</script>

<template>
    <h2>都道府県から探す</h2>
    <p>都道府県を選択することで、その都道府県に存在するエリアを表示することができます。</p>
    <Loading message="都道府県情報を読み込み中…" ref="loading" v-if="!done"/>
    <PrefBox v-for="pref in prefList" :pref="pref"/>

</template>

<style scoped>
</style>