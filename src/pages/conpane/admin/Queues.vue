<script setup lang="ts">
import { ref } from "vue";
import { axiosWithJWTToken, formatDate } from "../../../helpers/helpers";
import Loading from "../../../components/common/Loading.vue";


    // キュー一覧
    const queues = ref(null);

    // キューを取得
    axiosWithJWTToken("get", import.meta.env.PUBLIC_SERVER_ROOT + "/queues")
    .then((response) => {
        queues.value = response.data;
    });
</script>

<template>
    <div>
        <h2>キュー一覧</h2>
        <p>システムに登録されたキューの一覧を表示しています。横にある操作を選択することで、キューの承認や削除等を行うことができます。</p>

        <Loading v-if="queues === null" message="キュー情報を読み込んでいます…" />
        <table v-else border="1" style="table-layout: auto;">
            <thead>
                <tr>
                    <th>キューID</th>
                    <th>ユーザー名</th>
                    <th>コメント</th>
                    <th>登録日付</th>
                    <th>審査日付</th>
                    <th>状態コメント</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="queue in queues">
                    <td>{{ queue.id }}</td>
                    <td>{{ queue.userId }}</td>
                    <td>{{ queue.comment ?? "コメントなし" }}</td>
                    <td>{{ formatDate(queue.createDate) }}</td>
                    <td>{{ formatDate(queue.acceptDate) ?? formatDate(queue.deniedDate) ?? "未審査" }}</td>
                    <td>{{ queue.statusComment ?? "コメントなし" }}</td>
                    <td>
                        <RouterLink :to="`/conpane/queue/${queue.id}`"><i class="fa-solid fa-circle-info" title="詳細を見る"></i></RouterLink> 
                        <RouterLink :to="`/conpane/queue/${queue.id}/check`"><i class="fa-solid fa-calendar-check" title="審査を行う"></i></RouterLink>
                        <RouterLink :to="`/conpane/queue/${queue.id}/delete`"><i class="fa-solid fa-trash" title="削除する"></i></RouterLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    i {
        margin: 0.5rem 0.5rem;
        font-size: 2rem;
        cursor: pointer;
        text-decoration: underline;
    }

    td {
        padding: 0.5rem;
    }
</style>