<script lang="ts" setup>
    import HelpSearch from '../../components/common/HelpSearch.vue';
import IntersectionSearchForm from '../../components/common/IntersectionSearchForm.vue';
import { setHeader } from '../../helpers/helpers';
    import { useSearchStore } from '../../store';
    import { ref } from 'vue';

    // 使い方ページの内容を表示するかどうかのフラグ
    const done = ref(false);

    // すでに一度理解している場合はスキップ
    const searchStore = useSearchStore();
    done.value = searchStore.done;

    // 読んだらフラグ立てる
    function read() {
        searchStore.done = true;
        done.value = true;
    }

    // もう一度読みたいとき
    function unread() {
        searchStore.done = false;
        done.value = false;
    }

    setHeader("予備調査");
</script>

<template>
    <div>
        <!-- 共通項目 -->
        <h2>予備調査ツール</h2>
        <p>JIDSのバージョンを一新した都合上、データベースを直接操作して予備調査を行うのが困難になったため、Web上で予備調査を編集することができるツールを公開しています。</p>

        <!-- 使い方 -->
        <div>
            <h3>使い方</h3>
            <HelpSearch v-if="!done" @read="read"/>
            <div v-else>
                <p>既に使い方を一度読んでいるのでデフォルトで閉じています。<a @click="unread" style="text-decoration: underline; cursor: pointer;">ここをクリックしてもう一度読むことができます。</a></p>
            </div>
        </div>

        <!-- 絞り込み検索は通常交差点検索と同様 -->
        <h3>絞り込み検索</h3>
        <IntersectionSearchForm />


    </div>
</template>

<style lang="css" scoped>

</style>