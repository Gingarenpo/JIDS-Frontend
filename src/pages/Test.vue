<script type="ts" setup></script>

<template>
    <form action="http://127.0.0.1:3000/upload/" method="post" enctype="multipart/form-data">
        <input name="file" type="file" />
        <input type="submit" />
    </form>
</template>

<style scoped></style>