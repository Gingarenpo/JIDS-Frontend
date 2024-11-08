<script lang="js" setup>
    const root = import.meta.env.PUBLIC_SERVER_ROOT;
</script>

<template>
    <h2>JIDS API Explorer</h2>
    <p>こちらのページでは、JIDSのAPIを実行することができます。なお、実際のドキュメントは<a :href="root + '/docs'" target="_blank">こちら</a>からご覧いただけますが、自動生成且つソースの整形が追いついていないのであまり参考になりません。</p>
    <div class="warn">
        <p>APIレートを消費します</p>
        <p>APIを実際に試す場合、現在ログイン中のアカウントで実行したとみなされAPIレートを消費します。一定回数使用するとしばらくの間実行できなくなりますのでご注意ください。</p>
    </div>

    <h3>1. 使用するエンドポイントを選択してください</h3>

    <h3>2. パラメーターを入力してください</h3>
    <p>各パラメーターは、「キー=値」として入力し、複数ある場合は改行してください。</p>

    <h3>3. 実行して結果を見ましょう</h3>
    <p><button>こちら</button>をクリックすることでAPIを実行します。実行結果は下部に表示されます。</p>
</template>

<style lang="css" scoped></style>