<template>
    <p @click="$router.go(-1)">前のページに戻る</p>
</template>

<style scoped>
    p {
        cursor: pointer;
        text-decoration: underline;
        margin: 0.5rem 0.5rem;
    }
</style>