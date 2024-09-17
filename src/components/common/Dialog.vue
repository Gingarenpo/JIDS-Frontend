<script lang="ts" setup>
    const props = defineProps(["title"]);
</script>

<template>
    <div id="overlay"></div>
    <div id="dialog">
        <p>{{ props.title }}</p>
        <slot>Ooops</slot>
    </div>
</template>

<style scoped>
    #overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2;
        animation: show 0.3s both;
    }

    @keyframes show {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes show-dialog {
        0% {
            transform: scale(0.5);
        }
        100% {
            transform: scale(1);
        }
    }


    #dialog {
        background-color: white;
        border: 1px solid gray;
        width: 50vw;
        height: 50vh;
        position: fixed;
        top: 25vh;
        left: 25vw;
        z-index: 3;
        border-radius: 1rem;
        padding: 1rem;
        animation: show-dialog 0.3s both;
    }

    :slotted(button) {
        display: block;
        margin: auto;
        width: 50%;
        position: absolute;
        bottom: 1rem;
        left: 25%;
    }

    #dialog p:first-child {
        font-size: 1.5rem;
        font-weight: 900;
        border-bottom: 2px solid gray;
        margin-bottom: 1rem;
    }
</style>