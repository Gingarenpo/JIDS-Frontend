<script lang="ts" setup>
    import { ref } from 'vue';
    // Props
    const props = defineProps(["message"]); // あくまでデフォルト

    // メッセージを格納するref
    const message = ref(props.message);

    // Loadingアイコンはタイムアウト時間を超えたら文言を変える
    setTimeout(() => {
        message.value = "ちょっと時間がかかっているようです……";
    }, 5000);
    setTimeout(() => {
        message.value = "あまりにも時間がかかりすぎています……";
    }, 10000);
    setTimeout(() => {
        message.value = "エラーが発生している可能性があります……";
    }, 15000);

</script>

<template>
    <div class="loading">
        <div class="loading-icon"></div>
        <p>{{ message ?? "Now Loading" }}</p>
    </div>
</template>

<style scoped>
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .loading {
        display: flex;
        align-items: center;
    }
    .loading-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 100%;
        border: 0.25rem solid green;
        border-right: 0.25rem solid transparent;
        animation: rotate 1s linear infinite;
        margin: 0.2rem;
    }
    .loading p {
        margin-left: 0.5rem;
        font-size: 1.5rem;
    }
</style>