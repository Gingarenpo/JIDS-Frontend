<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useTokenStore } from '../../store';
    import { axiosWithJWTToken, formatDate, logout } from '../../helpers/helpers';
    import Loading from '../../components/common/Loading.vue';
    import { useRouter } from 'vue-router';
    import Dialog from '../../components/common/Dialog.vue';


    // 自分自身の情報を取得する
    const store = useTokenStore();
    const me = ref(null);
    const queue = ref(null);
    const router = useRouter();
    axiosWithJWTToken("get", import.meta.env.PUBLIC_SERVER_ROOT + "/users/me")
    .then((response) => {
        if (response == null) {
            router.push("/conpane/login");
        }
        me.value = response.data;
    });
    const errorMessages = ref([]);

    const doneRef = ref(false);

    // キュー情報取得
    axiosWithJWTToken("get", import.meta.env.PUBLIC_SERVER_ROOT + "/users/me/queues")
    .then((response) => {
        if (response == null) {
            router.push("/conpane/login");
        }
        queue.value = response.data;
    })

    // フォーム更新
    function update(e: Event) {
        e.preventDefault();
        if (document.forms.form.name.value == "" || document.forms.form.address.value == "") {
            errorMessages.value = ["項目を空にすることはできません。"];
            return;
        }
        if (document.forms.form.password.value != document.forms.form.password2.value) {
            errorMessages.value = ["新しいパスワードの確認用パスワードが一致しません。"];
            return;
        }
        // 送ってみる
        axiosWithJWTToken("post", import.meta.env.PUBLIC_SERVER_ROOT + "/users/update", new URLSearchParams(new FormData(document.forms.form)), 0)
        .then((response) => {
            if (response == null) {
                router.push("/conpane/login");
            }
            if (response.status != 201) {
                errorMessages.value = response.data.message;
            }
            else {
                errorMessages.value = [];
                doneRef.value = true;
            }
        })
    }

</script>

<template>
    <Loading v-if="!me" message="読み込み中…しばらくお待ちください。"/>
    <div v-if="me">
        <h2>ユーザーデータ</h2>
        <div class="info" v-if="errorMessages.length == 0">
            <p>一部の項目は変更できます</p>
            <p>現状に即した内容に更新することができます。更新をしたい場合は値を変更した後に「更新」をクリックしてください。</p>
            <p>なお、更新後はログアウトされますので再度ログインをお願いいたします。</p>
        </div>
        <div class="error" v-if="errorMessages.length > 0">
            <p>入力項目に誤りがあります</p>
            <ul>
                <li v-for="error in errorMessages">{{ error }}</li>
            </ul>
        </div>
        <p><label>ユーザーID</label><input type="text" :value="me.id" disabled></p>
        <p><i class="fa-solid fa-circle-xmark"></i>ユーザーIDを変更することはできません。どうしても変更を希望される場合は、管理者に連絡してください。</p>

        <form @submit="update" name="form">
            <p><label>名前</label><input type="text" :value="me.name" name="name"></p>
            <p><label>連絡先</label><input type="text" :value="me.address" name="address"></p>

            <hr>
            <p><i class="fa-solid fa-circle-exclamation"></i>現在のパスワードは表示することができません。パスワードを変更する場合は以下に新しいパスワードを入力してください。</p>
            <p><label>新しいパスワード</label><input type="password" name="password"></p>
            <p><label>新しいパスワード(確認用)</label><input type="password" name="password2"></p>

            <button>更新</button>
        </form>
    </div>

    <Dialog title="更新完了" v-if="doneRef">
        <p>更新が完了しました。ダイアログを閉じるとログアウトするので再度ログインをお願いいたします。</p>
        <button @click="logout">OK</button>
    </Dialog>

    <div v-if="queue">
        <h3>キュー一覧</h3>
        <p>{{ me.name }}さんが今までに送信されたキューの一覧を表示しています。</p>
        <table border="1">
            <tr>
                <th width="40%">キューID</th>
                <th width="10%">作成日時</th>
                <th width="10%">審査日時</th>
                <th width="20%">審査コメント</th>
                <th width="20%">ユーザーコメント</th>
            </tr>
            <tr v-for="q in queue">
                <td>{{ q.id }}</td>
                <td>{{ formatDate(q.createDate) }}</td>
                <td>{{ formatDate(q.acceptDate) ?? formatDate(q.acceptDate) ?? "-" }}</td>
                <td>{{ q.statusComment ?? "現在審査待ち" }}</td>
                <td>{{ q.comment }}</td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
    input {
        width: calc(100% - 2rem);
        margin: 0 1rem;
    }

    label {
        font-size: 0.8rem;
        font-weight: bold;
    }

    label[required]::after {
        content: '*';
        color: red;
        font-size: 1rem;
    }

    i {
        margin: 0.25rem;
    }

    button {
        padding: 0 2rem;
        margin: auto;
        display: block;
    }
</style>