<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { axiosWithJWTToken, getDataFromJWT } from '../../helpers/helpers';
    import { logout as logout2 } from '../../helpers/helpers';
    import { useRouter } from 'vue-router';
    import { useTokenStore } from '../../store';

    const store = useTokenStore();
    const router = useRouter();
    console.log(store);

    // JSONトークンを取得
    const json = computed(() => getDataFromJWT(store.token));

    axiosWithJWTToken("get", import.meta.env.PUBLIC_SERVER_ROOT + "/users/me");

    // ログアウト用関数
    function logout() {
        logout2();
        router.push({ name: "conpaneLogin" });
    }


    
</script>

<template>
    <h2>ようこそ</h2>
    <p>JIDSのコントロールパネルへようこそ。こちらでは、情報の取得・修正・作成などを行うことができます。</p>
    <div class="menu">
        <div><RouterLink to="/conpane/me">
            <i class="fa-solid fa-user"></i>
            <p>ユーザー情報</p>
            <p>{{ json?.user_name }}さんの情報を確認・修正できます。</p>
        </RouterLink></div>

        <div><RouterLink to="/conpane/upload">
            <i class="fa-solid fa-file-arrow-up"></i>
            <p>ファイルアップロード</p>
            <p>サムネイル、現地調査の画像をアップロードできます。</p>
        </RouterLink></div>

        <div><RouterLink to="/conpane/search">
            <i class="fa-solid fa-list-ol"></i>
            <p>予備調査</p>
            <p>全国の交差点の予備調査を行うことができます。<br>専用のツールを用意しています。</p>
        </RouterLink></div>

        <div><RouterLink to="/conpane/help">
            <i class="fa-solid fa-circle-question"></i>
            <p>ヘルプ</p>
            <p>わからないことはこちらで解決できます。<br>お問い合わせもこちらから。</p>
        </RouterLink></div>

        <div :class="{disabled: (json !== null && json.user_rank != -1)}"><RouterLink to="/conpane/admin">
            <i class="fa-solid fa-database"></i>
            <p>データ管理</p>
            <p v-if="json !== null &&json.user_rank == -1">ユーザー・キューの情報管理を行います。</p>
            <p v-else>この機能は最高管理者のみ使用できます。</p>
        </RouterLink></div>

        <div @click="logout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <p>ログアウト</p>
            <p>またのご利用をお待ちしております。</p>
        </div>
    </div>

    <p>一定時間無操作の状態が続くとログアウトされる場合があります。その際はお手数ですが再度ログインしなおしてください。</p>
</template>

<style scoped>
    .menu {
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
    }

    .menu > div > a {
        text-decoration: none;
    }

    .menu > div {
        display: block;
        border: 1px solid gray;
        background-color: white;
        padding: 0.5rem;
        flex-basis: 32%;
        margin: 0.25rem;
    }

    .menu > div.disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
    }

    .menu > div.disabled a {
        cursor: not-allowed;
        pointer-events: none;
    }

    .menu > div:not(.disabled):hover {
        background-color: var(--light-color);
    }

    .menu > div i {
        font-size: 4rem;
        display: block;
        margin: auto;
        width: 100%;
        text-align: center;
    }

    .menu > div p:nth-child(2) {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
    }

    .menu > div p {
        text-align: center;
    }

    @media screen and (max-width: 800px) {
        .menu {
            flex-direction: column;
        }
    }
</style>