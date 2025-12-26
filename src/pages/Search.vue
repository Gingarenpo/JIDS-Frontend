<script lang="ts" setup>
    // axiosを用いて都道府県情報を取得
    import {ref, onMounted} from 'vue';
    import axios from 'axios'
    import PrefBox from '../components/PrefBox.vue';
    import {setHeader} from '../helpers/helpers';
import SearchResult from '../components/common/SearchResult.vue';
import IntersectionSearchForm from '../components/common/IntersectionSearchForm.vue';

    // ヘッダーを設定
    setHeader("詳細に探す", "日本全国の信号機に関する情報を、都道府県から探すことができます。", "都道府県,交差点,信号機,検索,交通信号機");

    // 結果一覧を表示するためのもの
    const result = ref(null);

    // 検索結果を表示する
    const show = (res) => {
        result.value = res;
    }
    
</script>

<template>
    <div>
        <h2>詳細に探す</h2>
        <IntersectionSearchForm @search="show" />
        <SearchResult v-if="result != null && result.length > 0" :intersections="result" />
        <div v-else-if="result != null">
            <div class="warn">
                <p>何も見つかりませんでした</p>
                <p>条件に該当する交差点はありません。</p>
            </div>
        </div>
    </div>

</template>

<style scoped>
</style>