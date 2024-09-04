<script lang="ts" setup>
    import noImage from '../assets/images/noimage.jpg';

    // エリア情報を格納するprops
    const props = defineProps(["area", "pref"]);
</script>

<template>
    <RouterLink :to="`/${props.pref.id}/${props.area.id}`" class="no-link">
        <div class="flex">
            <img :src="props.area.thumbnail ?? noImage">
            <div>
                <h2>[{{ props.area.id }}] {{ props.area.name }}{{ props.pref.manage == 'POLICE' && props.area.managed ? '警察署' : '' }}</h2>
                <p>{{ props.area.description }}（{{ Math.round(props.area.all_count / props.area.area * 100) / 100 }}交差点 / km²）</p>
                <div class="icon-list">
                    <div :title="`${props.area.name}の交差点数。推定数も含みます。`">
                        <i class="fa-solid fa-table-list"></i>
                        <p>{{ props.area.all_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.area.name}の調査済み交差点数。`">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <p>{{ props.area.search_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.area.name}の現存交差点数。`">
                        <i class="fa-solid fa-circle-check"></i>
                        <p>{{ props.area.exist_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.area.name}のサムネ撮影済み交差点数。`">
                        <i class="fa-solid fa-image"></i>
                        <p>{{ props.area.thumbnail_count?.toLocaleString() }}</p>
                    </div>
                    <div :title="`${props.area.name}の現地調査済み交差点数。`">
                        <i class="fa-solid fa-camera"></i>
                        <p>{{ props.area.detail_count?.toLocaleString() }}</p>
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