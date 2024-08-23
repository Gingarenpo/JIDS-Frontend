<script lang="ts" setup>
    import noImage from '../assets/images/noimage.jpg';
    const props = defineProps([
        "pref", // 都道府県オブジェクト
    ]);

</script>

<template>
    <RouterLink :to="`/${props.pref.id}/area`" class="no-link">
        <div class="flex" :class="{disabled: props.pref.area_count == 0}">
            <img :src="props.pref.image ?? noImage">
            <div>
                <h2>[{{ props.pref.id }}] {{ props.pref.name }}</h2>
                <p v-if="props.pref.area_count == 0">{{ props.pref.name }}はシステム整備中か、交差点管理方法が不明のためデータベース登録ができない状況となっています。</p>
                <p v-else="props.pref.area_count == 0">クリックすると、{{ props.pref.name }}のエリア一覧を表示します。</p>
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
    }
    .disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
    }
</style>