<script lang="ts" setup>
    import zip from '../../assets/images/conpane/zip.png';
    import {computed, ref} from 'vue';
    import { useUploadStore } from '../../store';
    import Dialog from '../../components/common/Dialog.vue';
    import axios, { AxiosProgressEvent } from 'axios';
    import { axiosWithJWTToken, formatByte } from '../../helpers/helpers';
    import Loading from '../../components/common/Loading.vue';
    import { useRouter } from 'vue-router';

    // はじめにフラグ
    const done = ref(false);
    const router = useRouter();

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
            const data = response.data;
            // nullの場合はトークン再発行にも失敗している
            if (data == null) {
                router.push({ name: "conpaneLogin" });
                return;
            }
            if (response.status == 400) {
                uploadFlag.value = -2;
                errorMessage.value = data.message;
                return;
            }
            // 処理完了;
            // それぞれ代入
            ignores.value = data.entries.ignore;
            thumbnails.value = data.entries.thumbnail;
            details.value = data.entries.detail;

            if (data.message != undefined) {
                // 何らかのエラーが発生している
                uploadFlag.value = -1;
                return;
            }
            // キューIDを代入
            queueId.value = data.queue.id;

            uploadFlag.value = 4;
        })
        .catch(ex => {
            console.log(ex);
            // 400エラーの場合不正リクエスト
            
        });
    }

    // アップロードタイトル
    const uploadTitle = computed(() => {
        return (
            uploadFlag.value == 0 || uploadFlag.value == 1 ? "アップロード中…"
            : uploadFlag.value == 2 ? "キュー処理中"
            : "アップロード結果"
        )
    });

    // アップロード中の進捗
    const progress = ref(0);
    const loaded = ref(0);
    const total = ref(0);
    function uploading(e: AxiosProgressEvent) {
        progress.value = e.progress ?? 0;
        loaded.value = e.loaded ?? 0;
        total.value = e.total ?? 0;
        // 完了した場合はフラグ返る
        if (e.progress == 1) {
            uploadFlag.value = 2;
        }
    }

    // キューID
    const queueId = ref("");

    // 結果格納
    const ignores = ref([]);
    const thumbnails = ref([]);
    const details = ref([]);

    const errorMessage = ref("");


    // ダイアログ閉じる
    function closeDialog(e) {
        uploadFlag.value = 0;
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
        
        <p>Zipファイルは<b>4GB</b>までのファイルをアップロードすることができます。</p>
        <form name="form" @submit="upload">
            <input type="file" name="file" accept="application/zip" required>
            <p>必要ならばコメントを入力してください。この情報は最高管理者とあなたしか閲覧できません。</p>
            <textarea name="comment" placeholder="ここにコメントを入力"></textarea>
            <input type="submit" value="Zipファイルを送信する">
        </form>

        <Dialog :title="uploadTitle" :type="uploadFlag < 0 ? 'error' : 'info'" v-if="uploadFlag != 0">
            <div v-if="uploadFlag == 1">
                <p>アップロード中です。しばらくお待ちください。</p>
                <progress :value="progress"></progress>
                <p>{{ formatByte(loaded) }} / {{ formatByte(total) }}</p>
            </div>
            <div v-else-if="uploadFlag == 2">
                <Loading message="Zipファイルをチェックしています……" :timeout="60000"/>
            </div>
            <div v-else-if="uploadFlag == 4">
                <p>キューが登録されました。<br><br>キューIDは「{{ queueId }}」です。<br><br>このキューIDは確認時に必要となりますので、控えてください。</p>
                <p>検出結果：サムネイル{{ Object.values(thumbnails).map(x => Object.values(x).map(y => Object.values(y))).flat(Infinity).length }}交差点 / 現地調査{{ Object.values(details).map(x => Object.values(x).map(y => Object.values(y))).flat(Infinity).length }}交差点</p>
                <p v-if="ignores.length > 0">なお、以下のファイルは無効なファイルとして登録されませんでした。結果が芳しくない場合は、再度アップロードしてください。</p>
                <ul style="border: 1px solid black; padding: 0 1rem; overflow-y: scroll; height: 10rem;" v-if="ignores.length > 0">
                    <li v-for="ignore in ignores">{{ ignore.path }}（{{ ignore.reason }}）</li>
                </ul>

                <button @click="closeDialog">OK</button>
            </div>
            <div v-else-if="uploadFlag == -1">
                <p>有効なファイルが存在しないため、キューが登録されませんでした。<wbr>以下に認識したファイル名と無効とみなされた理由を示しますので、<wbr>修正のうえ再送をお願いいたします。</p>
                <ul style="border: 1px solid black; padding: 0 1rem; overflow-y: scroll; height: 10rem;">
                    <li v-for="ignore in ignores">{{ ignore.path }}（{{ ignore.reason }}）</li>
                </ul>
                <button @click="closeDialog">OK</button>
            </div>
            <div v-else-if="uploadFlag == -2">
                <p>アップロードされたファイルに不備があるため、処理に失敗しました。以下の原因をお確かめの上、再送をお願いいたします。</p>
                <p style="color: red;">{{ errorMessage }}</p>
                <button @click="closeDialog">OK</button>
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