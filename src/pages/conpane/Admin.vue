<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { useTokenStore } from '../../store';
    import { computed } from 'vue';
    import { getDataFromJWT, isAccessible } from '../../helpers/helpers';


    const store = useTokenStore();
    const router = useRouter();

    isAccessible(-1).then((res) => {
        if (!res) {
            router.push("/conpane/");
        }
    })
    
</script>

<template>
    <div>
        <h2>管理ページ</h2>
        <p>最高管理者のみ確認可能なページです。JIDSのシステムに関する設定や、キューの承認を行うことができます。</p>

        <div class="menu">
            <div><RouterLink to="/conpane/admin/users">
                <i class="fa-solid fa-user"></i>
                <p>全ユーザー情報</p>
                <p>JIDSに登録している全ユーザーの情報を<br/>閲覧することができます。</p>
            </RouterLink></div>

            <div><RouterLink to="/conpane/admin/queues">
                <i class="fa-solid fa-folder"></i>
                <p>キュー情報</p>
                <p>JIDSに登録されたキューの管理を行うことができます。</p>
            </RouterLink></div>
       
    </div>
    </div>
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