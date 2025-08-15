<script lang="js" setup>
    import axios from 'axios';
    import { ref } from 'vue';
    import { axiosWithJWTToken } from '../../helpers/helpers';
import BackConpane from '../../components/common/BackConpane.vue';

    const root = import.meta.env.PUBLIC_SERVER_ROOT;

    // APIエンドポイント一覧を取得
    const endpoints = ref([]);

    // モデル保持用
    const endpoint = defineModel("endpoint");
    const body = defineModel("body");

    // リザルトを格納する変数
    const result = ref(null);
    
    axiosWithJWTToken("get", root + "/metas/endpoints").then(response => {
        endpoints.value = response.data;
    });

    // エンドポイントを実行
    function execute() {
        // endpointにselectの内容がバインドされ、bodyにtextareaの内容がバインドされる
        console.log(endpoint.value);
        axiosWithJWTToken(endpoint.value.method.toLowerCase(), root + ( "/" + endpoint.value.path).replace("//", "/"), body.value).then(response => {
            result.value = response.data;
        });
    }
</script>

<template>
    <h2>JIDS API Explorer</h2>
    <p>こちらのページでは、JIDSのAPIを実行することができます。なお、実際のドキュメントは<a :href="root + '/docs'" target="_blank">こちら</a>からご覧いただけますが、自動生成且つソースの整形が追いついていないのであまり参考になりません。</p>
    <div class="warn">
        <p>APIレートを消費します</p>
        <p>APIを実際に試す場合、現在ログイン中のアカウントで実行したとみなされAPIレートを消費します。一定回数使用するとしばらくの間実行できなくなりますのでご注意ください。</p>
    </div>

    <h3>1. 使用するエンドポイントを選択してください</h3>
    <select name="endpoint" v-model="endpoint">
        <option v-for="endpoint in endpoints" :value="endpoint">[{{ endpoint.method }}]{{ endpoint.path }}</option>
    </select>

    <h3>2. パラメーターを入力してください</h3>
    <p>各パラメーターは、「キー=値」として入力し、複数ある場合は改行してください。</p>
    <textarea name="body" rows="10" v-model="body"></textarea>

    <h3>3. 実行して結果を見ましょう</h3>
    <p><button @click="execute">こちら</button>をクリックすることでAPIを実行します。実行結果は下部に表示されます。</p>
    <div class="result">
        <pre>{{ result }}</pre>
    </div>

    <BackConpane />
</template>

<style lang="css" scoped>
    textarea {
        width: 100%;
    }

    .result {
        width: calc(100% - 2rem);
        height: 20rem;
        overflow: scroll;
        border: 1px solid gray;
        border-radius: 0.5rem;
        padding: 0.5rem;
        background-color: white;
        margin: 1rem;
    }
</style>