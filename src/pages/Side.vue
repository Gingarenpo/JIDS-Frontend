<script lang="ts" setup></script>

<template>
    <section>
        <h2>メニュー</h2>
        <ul>
            <li><RouterLink to="/pref">都道府県から探す</RouterLink></li>
            <li><RouterLink to="/map">地図から探す</RouterLink></li>
        </ul>
    </section>
</template>

<style scoped>
h2 {
    font-size: 1.5rem;
    text-align: center;
}
section {
    border: 1px solid silver;
    margin: 0.2rem;
    border-radius: 0.2rem;
    box-shadow: 0 0.25rem rgba(0, 0, 0, 0.5);
    margin-bottom: 0.4rem;
}
</style>