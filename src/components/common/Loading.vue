<script lang="ts" setup>
    import { ref } from 'vue';
    // Props
    const props = defineProps(["message"]); // あくまでデフォルト

    // メッセージを格納するref
    const message = ref(props.message);

    // メッセージの内容を変更するfunction
    function changeMessage(newMessage: string) {
        message.value = newMessage
    }

    defineExpose({changeMessage})
</script>

<template>
    <div class="loading">
        <div class="loading-icon"></div>
        <p>{{ props.message ?? "Now Loading" }}</p>
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