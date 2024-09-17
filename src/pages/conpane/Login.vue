<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import axios from 'axios';
    import { useCookies } from 'vue3-cookies';
    import { useRouter } from 'vue-router';
import { useTokenStore } from '../../store';

    const store = useTokenStore();
    const { cookies } = useCookies();
    const router = useRouter();

    // エラーメッセージ
    const error = ref(null);

    // ログインを行う関数
    const asyncLogin = async () => {
        const idx = document.getElementsByName("id")[0].value;
        const passwordx = document.getElementsByName("password")[0].value;
        if (idx == "" || passwordx == "") {
            error.value = "ユーザーIDとパスワードを入力してください。";
            return false;
        }
        axios.post(import.meta.env.PUBLIC_SERVER_ROOT + "/auth/login", {
            id: idx,
            password: passwordx,
        })
        .then(response => {
            error.value = null;
            store.login(response.data.access_token);
            cookies.set("user_id", idx);
            cookies.set("password", passwordx);
            router.push({ name: "conpaneTop" });
            
        })
        .catch(e => {
            if (e.response == undefined) {
                console.error(e);
                return;
            }
            switch (e.response.status) {
                case 401:
                    error.value = "ユーザーIDまたはパスワードが間違っています。";
                    break;
                case 429:
                    error.value = "1日のログイン最大試行回数に達しました。翌日お試しください。";
                    break;
                default:
                    error.value = "ログインに失敗しました。";
            }
        });
    };


    
</script>

<template>
    <h2>ログイン</h2>
    <p class="error" v-if="error != null">{{ error }}</p>
    <p>ユーザーID: <input type="text" name="id" autocomplete="userId" required></p>
    <p>パスワード: <input type="password" name="password" autocomplete="current-password" required></p>
    <p><button @click="asyncLogin">ログイン</button></p>

    <hr>

    <p>まだアカウントをお持ちでない場合は、<RouterLink to="/conpane/signup">登録</RouterLink>してください。</p>
    <p>パスワードを忘れた場合は、<RouterLink to="/conpane/password-reissue">パスワード再設定</RouterLink>してください。</p>

    <div class="warn">
        <p>ログインについて</p>
        <p>ログインに複数回失敗すると、一時的にロックがかかります。ご注意ください。</p>
    </div>

</template>

<style scoped>
    .error {
        background-color: var(--error-bg-color);
        color: var(--error-color);
    }
</style>