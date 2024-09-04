<script lang="js" setup>
    import { computed } from 'vue';
import noImage from '../assets/images/noimage.jpg';

    const props = defineProps({
        intersection: Object,
        area: Object,
    });

    const area = props.area ?? props.intersection.area;

    // 移管先の交差点を計算
    const moveTo = computed(() => {
        if (props.intersection.status == 'MOVE') {
            // DD-DD(へ|に)移管、とあればその中身になる
            let m = props.intersection.comment.match(/(\d+-[0-9A-Za-z]+)(?:へ|に)移管/);
            if (m != null) {
                return m[1];
            }
            m = props.intersection.comment.match(/(.+署)(?:へ|に)移管/);
            if (m != null) {
                return m[1];
            }
            return 'どこか';
        }
        else {
            return ''; // 使わん
        }
    });

    // 状態を変換（埋め込むと長ったらしい）
    const status = computed(() => {
        switch (props.intersection.status) {
            case 'LIVE':
                return "現存";
            case 'UNKNOWN':
                return "行方不明";
            case 'GONE':
                return "廃止";
            case 'MOVE':
                return "移管";
            case 'MERGE':
                return "統合";
            default:
                return "不明";
        }
    });

    // 都市
    const city = computed(() => {
        if (props.intersection.location.city != null) {
            const m = props.intersection.location.city.match(/^(.+?[都道府県])(.+?[市区郡町村])(.+?[区町村])?$/);
            return m != null ? m.slice(1) : ["", "不明"];
        }
        return "不明";
    })

</script>

<template>
    <RouterLink :to="`/${props.intersection.prefId}/${props.intersection.areaId}/${props.intersection.id}`" class="no-link">
        <div class="flex" :class="
            {
                'detail': props.intersection.details.length > 0,
                'thumbnail': props.intersection.thumbnails.length > 0,
                'rover': props.intersection.rover & 2,
                'gone': props.intersection.status == 'GONE' || props.intersection.status == 'MERGE'
            }
            " v-if="props.intersection.name != null && props.intersection.status != 'MOVE'">
            <img :src="props.intersection.thumbnail ?? noImage">
            <div>
                <h2>[{{ props.intersection.areaId }}-{{ props.intersection.id >= area.unknownStart ? '???' : props.intersection.id }}] {{ props.intersection.name }}{{ props.intersection.isOfficialName ? '' : '（仮）' }}</h2>
                <div class="info">
                    <div>
                        <p>新設年度</p>
                        <p>{{ props.intersection.operationYear ?? '不明' }}</p>
                    </div>
                    <div>
                        <p>{{ props.intersection.status == 'GONE' || props.intersection.status == 'MERGE' ? '廃止' : '更新'}}年度</p>
                        <p>{{ (props.intersection.operationYear == props.intersection.refreshYear && props.intersection.operationYear != null) ? '-' : props.intersection.refreshYear ?? '不明' }}</p>
                    </div>
                    <div>
                        <p>状態</p>
                        <p>{{ status }}</p>
                    </div>
                    <div>
                        <p>場所</p>
                        <p><span class="city">{{ city[0] }}</span><span v-html="city[2] != undefined ? `<span style='font-size: 1.5rem;'>${city[1]}</span><wbr>${city[2]}` : `${city[1]}`"></span></p>
                    </div>
                    <div>
                        <p>車灯構成</p>
                        <p v-html="props.intersection.cars.join(`<br>`)"></p>
                    </div>
                    <div>
                        <p>歩灯構成</p>
                        <p v-html="props.intersection.peds.length == 0 ? `不明` : props.intersection.peds.join(`<br>`)"></p>
                    </div>
                </div>
                <hr v-if="props.intersection.comment">
                <p>{{ props.intersection.comment }}</p>
            </div>
        </div>

        <div class="flex move" v-if="props.intersection.status == 'MOVE'">
            <p>[{{ props.area.id }}-{{ props.intersection.id }}] → <span class="move-to">{{ moveTo }}</span>に移管されました。</p>
        </div>

        <div class="flex" :class="{'unknown': props.intersection.status == 'UNKNOWN', 'disabled': props.intersection.status == 'LIVE'}" v-if="props.intersection.name == null">
            <img :src="props.intersection.thumbnail ?? noImage">
            <p>[{{ props.area.id }}-{{ props.intersection.id }}]は{{ props.intersection.status == 'UNKNOWN' ? '過去に存在したものの、情報がなく行方不明' : '未調査・未発見' }}です。</p>
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
    .flex.move {
        background-color: var(--disabled-color);
        cursor: not-allowed;
    }
    .flex.disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
    }
    .flex.unknown {
        background-color: var(--unknown-color);
        cursor: help;
    }
    .flex.gone {
        background-color: var(--gone-color);
    }
    .flex.thumbnail {
        background-color: var(--thumbnail-color);
    }
    .flex.rover {
        background-color: var(--rover-color);
    }
    .flex.detail {
        background-color: var(--detail-color);
    }
    .flex > div {
        width: 100%;
    }
    .move-to {
        font-size: 1.5rem;
        font-weight: 900;
    }
    p {
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
    .info {
        display: flex;
        justify-content: flex-start;
        align-items: top;
        width: 100%;
        flex-wrap: wrap;
    }
    .info div {
        flex-basis: 25%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }
    .info div p:first-child {
        font-size: 1rem;
        line-height: 0.8rem;
    }
    .info div p:nth-child(2), .info div p:nth-child(2) span:not(.city):not(.group) {
        font-size: 2rem;
        font-weight: 900;
    }
    .city {
        display: block;
        font-size: 1.2rem;
    }
    .city .group {
        font-size: 1.5rem;
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