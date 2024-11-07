<script lang="ts" setup>
    import { computed } from 'vue';
    const props = defineProps({
        title: { type: String, default: "Dialog" },
        type: { type: String, default: "info" },
    });

    const iconClass = computed(() => {
        switch (props.type) {
            case "info":
                return "fa-solid fa-info-circle";
            case "warning":
                return "fa-solid fa-exclamation-triangle";
            case "error":
                return "fa-solid fa-circle-xmark";
            default:
                return "fa-solid fa-info-circle";
        }
    })
</script>

<template>
    <div id="overlay"></div>
    <div id="dialog" :class="props.type">
        <div class="contents">
            <p><i :class="iconClass"></i>{{ props.title }}</p>
            <slot>Ooops</slot>
        </div>
        <button v-if="props.showButton">OK</button>
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

    #dialog .contents {
        height: 90%;
        overflow-y: scroll;
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

    #dialog p:first-child i {
        font-size: inherit;
        color: inherit;
    }

    #dialog.warn p:first-child {
        color: orange;
    }

    #dialog.error p:first-child {
        color: red;
    }
</style>