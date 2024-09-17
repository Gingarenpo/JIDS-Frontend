<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import Dialog from '../../components/common/Dialog.vue';

const error = ref(null);
const res = ref(null);


function checkData(e: Event) {
    e.preventDefault();
    const form = document.forms.form;
    
    // クライアントチェックは基本せずに、axiosでサインアップ任せる
    axios.post(import.meta.env.PUBLIC_SERVER_ROOT + "/users/create", new URLSearchParams(new FormData(form)))
    .then(response => {
        res.value = response.data;
    })
    .catch(e => {
        // 400エラーの場合はバリデーションチェックエラー
        if (e.response.status == 400) {
            error.value = e.response.data.message;
            document.getElementById("error")?.scrollTo({behavior: "smooth"});
        }
    });
}
</script>

<template>
    <h2>アカウントの新規作成</h2>
    <div class="warn">
        <p>アカウントを作成する前に</p>
        <p>同一人物による複数アカウントの作成は原則許可しておりません。すでにアカウントを作成している場合は、<RouterLink to="/conpane/login">ログイン</RouterLink>してください。</p>
        <p>単に交差点の情報を検索したいだけの場合は必ずしもアカウントを作成する必要はありません。<RouterLink to="/">トップページ</RouterLink>から交差点の検索を行えます。</p>
    </div>
    <p v-if="error == null">各項目を入力したうえで、アカウントを作成してください。*印のある項目は必須項目です。</p>
    <p v-else>入力項目にエラーがあります。再度お確かめください。</p>
    <form @submit="checkData" name="form">
        <div class="error" v-show="error != null" id="error"><p>入力項目にエラーがあります</p><ul><li v-for="e in error">{{ e }}</li></ul></div>
        <p><label required>ユーザーID</label><input type="text" name="id" autocomplete="userId" required></p>
        <p>ユーザーIDは、ログイン時に利用します。<b>一度決めると変更できません。</b>半角英数字と一部の記号のみで、64文字以内で入力してください。</p>

        <p><label required>名前</label><input type="text" name="name" autocomplete="name" required></p>
        <p>情報提供者名としてサイト上に表示されます。全角文字なども入力可能で、256文字以内で入力してください。ただし、不適切だと最高管理者が判断した場合、変更する場合があります。</p>

        <p><label required>パスワード</label><input type="password" name="password" autocomplete="password" required></p>
        <p><label required>パスワード(確認用)</label><input type="password" name="password2" autocomplete="password" required></p>
        <p>パスワードは以下の要件を満たす必要があります。</p>
        <ul>
            <li>英大文字・小文字、数字を最低1文字以上含めること。</li>
            <li>最低でも8文字以上にすること。（推奨は16文字以上）</li>
        </ul>
        <div class="warn">
            <p>パスワードの保存について</p>
            <p>パスワードは使いまわさずに、なるべくセキュアなものを使用してください。システム側でもセキュリティには十二分に気を付けていますが、それにも限界があります。</p>
            <p>またシステム側も入力されたパスワードを知る由はないので、パスワードを忘れた方は再発行が必要になります。</p>
        </div>

        <p><label required>連絡先</label><input type="text" name="address" autocomplete="address" required></p>
        <p>連絡先は以下のものが有効となります。常時連絡可能なものを指定してください。パスワード再発行時はこの情報も必要となります。</p>
        <ul>
            <li>メールアドレス（例: hogehoge@example.com）</li>
            <li>Fediverse（Mastodon、Misskeyなど）アカウント（例: @hogehoge@example.com）</li>
            <li>Twitterアカウント（例: @hogehoge）　※非推奨</li>
        </ul>
        <p>入力できない連絡先を使用したい場合は個別に最高管理者へお問い合わせください。</p>

        <hr>

        <p>アカウントを作成すると、<RouterLink to="/conpane/rule">利用規約（整備中）</RouterLink>に同意したことになります。よろしければ、<button>アカウントを作成</button>してください。</p>
    </form>

    <Dialog :title="`ようこそ、${res.name}さん！`" v-if="res != null">
        <p>アカウントの作成が完了しました。ログイン画面から、ログインを行ってください。</p>
        <button><RouterLink to="/conpane/login">ログイン画面へ</RouterLink></button>
    </Dialog>
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
</style>