<script lang="ts" setup>
    import { ref } from 'vue';

    // 共有交差点情報
    const intersections = defineModel();

    // ソートとフィルター
    const sort = ref("id");
    const order = ref("asc");

    function sortAndFilter(): Array<any> {
        console.log(sort);
        intersections.value.sort((a, b) => {
            if (sort.value == "id") return (a.id - b.id) * (order.value == "asc" ? 1 : -1);
            if (sort.value == "name") return (a.name.localeCompare(b.name)) * (order.value == "asc" ? 1 : -1);
            if (sort.value == "year") return (a.operationYear - b.operationYear) * (order.value == "asc" ? 1 : -1);
            if (sort.value == "refyear") return (a.refreshYear - b.refreshYear) * (order.value == "asc" ? 1 : -1);
        });
    }
</script>

<template>
    <div>
        <p><select name="sort" v-model="sort">
            <option value="id">番号</option>
            <option value="name">交差点名</option>
            <option value="year">新設年度</option>
            <option value="refyear">更新年度</option>
        </select>の<select name="order" v-model="order">
            <option value="asc">昇順</option>
            <option value="desc">降順</option>
        </select>で<button @click="sortAndFilter()">ソートする</button></p>
    </div>
</template>

<style scoped>

</style>