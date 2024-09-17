<script lang="ts" setup>
    import zip from '../../assets/images/conpane/zip.png';
    import {ref} from 'vue';
    import { useUploadStore } from '../../store';
    import Dialog from '../../components/common/Dialog.vue';
    import axios, { AxiosProgressEvent } from 'axios';
    import { axiosWithJWTToken, formatByte } from '../../helpers/helpers';
    import Loading from '../../components/common/Loading.vue';

    // はじめにフラグ
    const done = ref(false);

    // すでに一度理解している場合はスキップ
    const uploadStore = useUploadStore();
    done.value = uploadStore.done;

    // 読んだらフラグ立てる
    function read() {
        uploadStore.done = true;
        done.value = true;
    }

    // もう一度読みたいとき
    function unread() {
        uploadStore.done = false;
        done.value = false;
    }

    // アップロードを開始する
    const uploadFlag = ref(0); // 定数みたいになるけど仕方がない
    function upload(e: SubmitEvent) {
        e.preventDefault();
        uploadFlag.value = 1;
        
        axiosWithJWTToken("post", import.meta.env.PUBLIC_SERVER_ROOT + "/upload", new FormData(document.forms.form), 0, {
            onUploadProgress: uploading,
        })
        .then(response => {
            //
        })
        .catch(ex => {
            // 
        });
    }

    // アップロード中の進捗
    const progress = ref(0);
    const loaded = ref(0);
    const total = ref(0);
    function uploading(e: AxiosProgressEvent) {
        progress.value = e.progress ?? 0;
        loaded.value = e.loaded ?? 0;
        total.value = e.total ?? 0;
    }
</script>

<template>
    <div v-if="!done">
        <h2>はじめに</h2>
        <p>現地調査情報、サムネイル情報をアップロードし、JIDSシステムに登録することができます。</p>
        <p>指定のディレクトリ階層に従って作成したZipファイルを、有効な情報提供として受理します。まずはZipファイルを作成するための方法を学びましょう。</p>

        <h3>ディレクトリの構成</h3>
        <p>まず、適当なディレクトリを作成します。そのディレクトリを<b>ルートディレクトリ</b>として、以下の図のように画像などを配置します。</p>
        <img :src="zip">
        <p>この図がすべてを物語っていますが、以下のような条件で画像やファイルを配置します。</p>
        <ul>
            <li>ルートディレクトリ直下に、今回アップロードする交差点の都道府県コードのディレクトリを作成します。（例：神奈川県の場合は「14」）</li>
            <li>各都道府県ディレクトリの中に、エリアコードのディレクトリを作成します。（例：神奈川県加賀町警察署の場合は「1」）</li>
            <li>各エリアコードのディレクトリの中に、交差点管理番号をファイル名にしたJPGファイルをサムネイル画像としておきます。</li>
            <li>現地調査の場合、各エリアコードのディレクトリの中にさらに撮影日を「YYYY-MMDD」で表したディレクトリを作成します。（例：2024年3月1日の場合は「2024-0301」）</li>
            <li>撮影日ディレクトリの中に、後述するファイル命名規則に従って画像ファイルといくつかのメタファイルをおきます。</li>
        </ul>
        <h3>現地調査データのファイル命名規則</h3>
        <p><span class="example"><span style="color: red;">S</span><sup>①</sup><span style="color: blue;">2</span><sup>②</sup>-<span style="color: green;">X</span><sup>③</sup><span style="color: orange">2</span><sup>④</sup>.JPG</span></p>
        <ol>
            <li>①全景図＝A、車灯＝S、歩灯＝H、制御機＝C、機械類＝M、その他＝O</li>
            <li>②各種類別通し番号（必ず1番からつけること。過去の現地調査データがある場合、同一位置に位置する灯器は同じ通し番号をつけること）。全景図の場合はここまで。</li>
            <li>③灯器の現示（G＝青、または青に相当する現示、Y＝黄、R＝赤、X＝矢印、F＝無点灯（一灯点滅や歩灯点滅などで使用））。ただし、機械類や制御機、その他の場合は1から始まる連番を付与する。</li>
            <li>④灯器の現示がXの場合のみ、1から連番を付与して区別する。</li>
        </ol>
        <p>拡張子は必ず「JPG」にしてください。画像ファイルの形式もJPEG形式にしてください。PNG形式のものなどをJPGに拡張子だけ変えても弾かれます。</p>

        <hr>
        <p>上記の内容を理解し、Zipファイルを作成したら<a @click="read" style="text-decoration: underline;">こちら</a>をクリックしてアップロードに進んでください。</p>
    </div>

    <div v-else>
        <p>※一度すでにキューの作り方を閲覧しているのでいきなりアップロード画面を表示しています。もう一度見返したい方は<a @click="unread" style="text-decoration: underline;">こちら</a>をクリックしてください。</p>
        <h2 id="upload">Zipファイルのアップロード</h2>
        <div class="error">
            <p>分割アップロードは原則禁止です</p>
            <p>Zipファイルでまとめることにより、1回のアップロードで複数の交差点をアップロードすることができます。数回に分けてZipファイルをアップロードする場合、やむを得ない場合を除いて原則すべて却下しますので、一度でお送りください。</p>
            <p>容量制限を設けておりますので、この限界に引っかかる場合は画像を圧縮してください。それができない場合（怠惰は理由になりません）のみ、分割アップロードを認めていますが、現状一気に10000枚くらいの写真を提供しない限り容量制限を超えることはないです。</p>
        </div>
        <div class="warn">
            <p>アップロード回数には制限があります</p>
            <p>サーバーへの負荷を防止する観点から、1日にアップロードできる回数に上限を設けています。上限に達した場合は翌日までお待ちください。</p>
        </div>
        <p>Zipファイルは<b>4GB</b>までのファイルをアップロードすることができます。</p>
        <form name="form" @submit="upload">
            <input type="file" name="file" accept="application/zip" required>
            <p>必要ならばコメントを入力してください。この情報は最高管理者とあなたしか閲覧できません。</p>
            <textarea name="comment" placeholder="ここにコメントを入力"></textarea>
            <input type="submit" value="Zipファイルを送信する">
        </form>

        <Dialog title="アップロードを実行中です……" v-if="uploadFlag > 0">
            <div v-if="uploadFlag == 1">
                <p>アップロード中です。しばらくお待ちください。</p>
                <progress :value="progress"></progress>
                <p>{{ formatByte(loaded) }} / {{ formatByte(total) }}</p>
            </div>
            <div v-else-if="uploadFlag == 2">
                <Loading message="Zipファイルをチェックしています……" :timeout="60000"/>
            </div>
        </Dialog>
    </div>

</template>

<style scoped>
    img {
        max-width: 50%;
        margin: auto;
    }

    .example, .example *:not(sup) {
        font-size: 8rem;
        font-weight: bold;
        text-align: center;
    }

    .example sup {
        vertical-align: 6rem;
        font-size: 2rem;
    }

    ol {
        margin: 1rem;
        list-style-type: none;
    }

    textarea {
        margin: 1rem;
        width: calc(100% - 2rem);
        height: 10rem;
    }

    form {
        margin: 0.25rem;
        border: 1px solid gray;
        padding: 0.5rem;
        background-color: white;
    }

    progress {
        background-color: white;
        border: 1px solid gray;
        width: 100%;
        border-radius: 0.5rem;
    }

    progress::-webkit-progress-value {
        background-color: var(--primary-color);
        border-radius: 0.5rem;
    }

    progress::-webkit-progress-bar {
        border-radius: 0.5rem;
    }
</style>