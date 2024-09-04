<script lang="ts" setup>
    import noImage from '../assets/images/noimage.jpg';
    import { computed } from 'vue';
    const props = defineProps([
        "pref", // 都道府県オブジェクト
    ]);

    const message = computed(() => {
        console.log(props.pref);
        if (props.pref.all_count == 0) {
            return props.pref.name + "は現在整備中か、交差点の管理方法などが不明瞭なため、閲覧することができません。";
        }
        else if (props.pref.all_count == 0) {
            return props.pref.name + "は現在整備中です。ページの閲覧はできますが交差点情報が1件もありません。";
        }
        else if (props.pref.search_count == 0) {
            return props.pref.name + "は交差点情報が1件も登録されていません。あなたが最初の予備調査者になってみませんか？";
        }
        else if (props.pref.search_count / props.pref.all_count < 0.1) {
            return props.pref.name + "の交差点情報が不足しています。あなたが最初の予備調査者になってみませんか？";
        }
        else if (props.pref.thumbnail_count == 0) {
            return props.pref.name + "はサムネイルが1件も登録されていません。交差点画像をお持ちですか？";
        }
        else if (props.pref.detail_count == 0) {
            return props.pref.name + "は現地調査が1件もされていません。地元の方ですか？　ぜひ情報提供をお願いいたします！";
        }
        else if (props.pref.thumbnail_count / props.pref.all_count < 0.1) {
            return props.pref.name + "のサムネイルが不足しています。交差点画像をお持ちですか？";
        }
        else if (props.pref.search_count == props.pref.all_count) {
            return props.pref.name + "の予備調査は完了しました。クリックorタップすると、" + props.pref.name + "のエリア一覧ページに遷移します。";
        }
        else {
            return "クリックorタップすると、" + props.pref.name + "のエリア一覧ページに遷移します。";
        }

    })

</script>

<template>
    <RouterLink :to="`/${props.pref.id}/`" class="no-link">
        <div class="flex">
            <img :src="props.pref.thumbnail ?? noImage">
            <div :class="{'disabled': props.pref.all_count == 0}">
                <h2>[{{ props.pref.id }}] {{ props.pref.name }}</h2>
                <p>{{ message }}</p>
                <div class="icon-list" v-if="props.pref.all_count > 0">
                    <div :title="`${props.pref.name}の交差点数。推定数も含みます。`">
                        <i class="fa-solid fa-table-list"></i>
                        <p>{{ props.pref.all_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.pref.name}の調査済み交差点数。`">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <p>{{ props.pref.search_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.pref.name}の現存交差点数。`">
                        <i class="fa-solid fa-circle-check"></i>
                        <p>{{ props.pref.exist_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.pref.name}のサムネ撮影済み交差点数。`">
                        <i class="fa-solid fa-image"></i>
                        <p>{{ props.pref.thumbnail_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.pref.name}の現地調査済み交差点数。`">
                        <i class="fa-solid fa-camera"></i>
                        <p>{{ props.pref.detail_count?.toLocaleString() }}</p>
                    </div>
                </div>
            </div>
        </div>
    </RouterLink>
</template>

<style scoped>
    .flex {
        background-color: white;
        margin: 0.5rem;
        cursor: pointer;
        border: 1px solid gray;
        width: calc(100% - 1rem);
    }
    .flex > div {
        width: 100%;
    }
    h2 {
        font-size: 1.5rem;
        background-color: var(--dark-color);
        color: white;
        border-radius: 0.5rem;
        padding: 0.2rem;
    }
    img {
        width: 20%;
        height: auto;
        flex-shrink: 0;
        align-self: center;
    }
    .disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
    }
    .icon-list {
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
    }
    .icon-list div {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0.5rem 0;
        flex-basis: 16%;
        flex-shrink: 0;
    }
    .icon-list div i {
        font-size: 3rem;
        font-weight: 900;
    }
    .icon-list div p {
        font-size: 2rem;
        font-weight: 900;
    }

    @media screen and (max-width: 800px) {
        .flex {
            flex-direction: column;
        }
        img {
            width: 100%;
        }
        .icon-list div {
            flex-basis: 30%;
        }
    }
</style>