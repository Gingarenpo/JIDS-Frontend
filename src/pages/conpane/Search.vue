<script lang="ts" setup>
    import HelpSearch from '../../components/common/HelpSearch.vue';
    import IntersectionSearchForm from '../../components/common/IntersectionSearchForm.vue';
    import { getAllPrefs, isAccessible, setHeader } from '../../helpers/helpers';
    import { useSearchStore } from '../../store';
    import { computed, onMounted, ref } from 'vue';
    import axios from 'axios';
    import Dialog from '../../components/common/Dialog.vue';
    import { useToast } from '../../composables/useToast';
import Loading from '../../components/common/Loading.vue';

    // トーストを作る
    const { show } = useToast();

    // 使い方ページの内容を表示するかどうかのフラグ
    const done = ref(false);

    // 検索結果の交差点情報を格納する
    const intersections = ref([]);

    // 編集結果の交差点情報を格納する（SQLの差分を用いるためのコピー）
    const editedIntersections = ref([]);

    const prefs = ref([]);
    // 車灯一覧
    const cars = ref([]);

    // 歩灯一覧
    const peds = ref([]);

    // 警告ダイアログ（状態保存・読み込み）
    const warning = ref("");

    // すでに一度理解している場合はスキップ
    const searchStore = useSearchStore();
    done.value = searchStore.done;

    // 最高管理者かどうか
    const superadmin = ref(false);

    // 差分内容
    const editedDiffs = ref([]);

    // サーバーに承認をもらっている最中かどうかのフラグ
    const sending = ref(false);

    // 審査完了時のサーバーレスポンス
    const checkResult = ref(null);


    // 読んだらフラグ立てる
    function read() {
        searchStore.done = true;
        done.value = true;
    }

    // もう一度読みたいとき
    function unread() {
        searchStore.done = false;
        done.value = false;
    }

    // 都道府県とエリアの情報を取得しておく
    onMounted(async () => {
        getAllPrefs(prefs);
        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/metas/codes")
        .then(response => {
            cars.value = response.data.cars;
            peds.value = response.data.peds;
        })
        .catch(error => {
            console.error(error);
        })

        // 最高管理者かどうか
        superadmin.value = await isAccessible(-1);
    })


    setHeader("予備調査");

    // 検索後、フォームを表示するためのデータ整形
    function getSearchData(values) {
        if (values == null) {
            return;
        }
        
        intersections.value = JSON.parse(JSON.stringify(values));
        editedIntersections.value = JSON.parse(JSON.stringify(values));

    }

    // 状態をLocalStorageに保存したりする関数
    function loadEditData() {
        if (localStorage.getItem("editedIntersections") == null || localStorage.getItem("intersections") == null) {
            // 保存された状態が存在しない場合
            show("状態が保存されていません！");
        }
        else {
            editedIntersections.value = structuredClone(JSON.parse(localStorage.getItem("editedIntersections")));
            intersections.value = structuredClone(JSON.parse(localStorage.getItem("intersections")));
            show("状態を読み込みました。");
        }
    }

    function saveEditData(force: boolean = false) {
        // LocalStorageに保存するが
        if (localStorage.getItem("editedIntersections") != null && !force) {
            // NULLじゃない場合は警告ダイアログを出す
            warning.value = "既に状態が保存されています。このまま保存する場合、現在の状態が上書きされます。よろしいですか？";
        }
        else {
            localStorage.setItem("editedIntersections", JSON.stringify(editedIntersections.value));
            localStorage.setItem("intersections", JSON.stringify(intersections.value));
            show("状態を保存しました。");
        }
    }

    function confirmEditData() {
        // 差分キーチェック用の巻数を定義
        const diffObject = (edited, original, ignoreKeys:string[] = []) => {
            const diffs: Record<string, {key: string, before : any, after : any}> = {};
            for (const key of Object.keys(edited)) {
                if (ignoreKeys.includes(key)) {
                    continue;
                }
                const e = edited[key];
                const o = original[key];

                if (JSON.stringify(e) !== JSON.stringify(o)) {
                    diffs[key] = {key: key, before: (original.prefId != null) ? o : null, after: e};
                }
            }
            return diffs;
        };

        // 結果を保存する
        const result = [];

        // intersectionsとeditedIntersectionsの差分をチェックする
        if (intersections.value.length > editedIntersections.value.length) {
            // もともと検索で出てきたものより「少ない」ことはあり得ない
            show("検証失敗");
            return;
        }
        // editedIntersectionsを基準に回す
        for (let editedKey = 0; editedKey < editedIntersections.value.length; editedKey++) {
            // 対応するintersectionを探す（行追加でも確かめているので添え字番号が一致するはず）
            let editedIntersection: [any] = editedIntersections.value[editedKey];
            let intersection: [any] = intersections.value[editedKey];

            // 都道府県がnullの場合は無視
            if (editedIntersection.prefId == null) {
                continue;
            }

            // 差分が存在しない場合は無視
            if (JSON.stringify(editedIntersection) === JSON.stringify(intersection)) {
                continue;
            }

            // どこが違うのかを差分として出す
            const diff = diffObject(editedIntersection, intersection, ["addLine"]);

            // もし差分が発生するなら
            if (Object.keys(diff).length > 0) {
                // 結果に差分を追加 TODO
                result.push({
                    edited: editedIntersection,
                    intersection: intersection,
                    diff: diff
                });
            }
            
        }

        // 差分内容をref更新
        editedDiffs.value = result;

        console.log(result);

        // 差分が0の場合はダイアログの表示がないので、トーストでお知らせ
        if (result.length == 0) {
            show("編集差分がありません。");
        }
        
    }

    // 緯度経度をコピーする
    function copyLocation(intersection) {
        if (intersection.location.x == "" || intersection.location.y == "") {
            show("緯度経度が未入力のためコピーできません。");
            return;
        }
        navigator.clipboard.writeText(`${intersection.location.y}, ${intersection.location.x}`)
        .then(() => {
            show(`緯度経度をコピーしました。 -> ${intersection.location.y}, ${intersection.location.x}`);
        })
        .catch((e) => {
            show(`緯度経度のコピーに失敗しました。 -> ${e.message}`);
        })
        
    }

    // GoogleMap形式の緯度経度を貼り付ける
    function pasteLocation(intersection) {
        navigator.clipboard.readText()
        .then(text => {
            const [y, x] = text.split(",");
            intersection.location.y = y;
            intersection.location.x = x;
        })
        .catch((e) => {
            show(`緯度経度の貼り付けに失敗しました。 -> ${e.message}`);
        })
    }

    // 編集内容をリセットする
    function resetData() {
        editedIntersections.value = [];
        intersections.value = [];
    }

    // 行を追加する（デフォルトで）
    // 元データにも空白データを足しておかないと整合性が取れなくなる
    function addEditData(last: boolean = true) {
        const obj = {
            prefId: null,
            areaId: null,
            id: "",
            status: "LIVE",
            name: "",
            sign: "",
            isOfficialName: false,
            decideYear: null,
            operationYear: null,
            refreshYear: null,
            cars: [],
            peds: [],
            rover: "0",
            sound: false,
            location: { x: "", y: "" },
            comment: "",
            addLine: true,
        };
        if (last) {
            editedIntersections.value.push(structuredClone(obj));
            intersections.value.push(structuredClone(obj));
        }
        else {
            editedIntersections.value.unshift(structuredClone(obj));
            intersections.value.unshift(structuredClone(obj));
        }
    }

    // 実際に予備調査のデータをサーバーサイドでチェックしてもらう
    async function sendEditData() {
        // まず送信中フラグを立てる
        sending.value = true;
    }
</script>

<template>
    <div>
        <!-- 共通項目 -->
        <h2>予備調査ツール</h2>
        <p>JIDSのバージョンを一新した都合上、データベースを直接操作して予備調査を行うのが困難になったため、Web上で予備調査を編集することができるツールを公開しています。</p>

        <!-- 使い方 -->
        <div>
            <h3>使い方</h3>
            <HelpSearch v-if="!done" @read="read"/>
            <div v-else>
                <p>既に使い方を一度読んでいるのでデフォルトで閉じています。<a @click="unread" style="text-decoration: underline; cursor: pointer;">ここをクリックしてもう一度読むことができます。</a></p>
            </div>
        </div>

        <!-- 絞り込み検索は通常交差点検索と同様 -->
        <h3>絞り込み検索</h3>
        <IntersectionSearchForm @search="getSearchData"/>

        <!-- 交差点が存在する場合、フォームを繰り返し作成 -->
        <p v-if="editedIntersections.length > 0"><em>{{ editedIntersections.length }}</em>件の交差点を表示しています。この中身でよければ編集を始めてください。編集後に再度検索を行うと、編集内容が失われますので注意してください。</p>
        
        <!-- 状態を保存する・読み込むボタンを表示 -->
        <div>
            <button @click="saveEditData(false)" v-if="editedIntersections.length > 0">状態を保存する</button>
            <button @click="loadEditData">状態を読み込む</button>
            <button @click="confirmEditData" v-if="editedIntersections.length > 0">編集内容を確認する</button>
            <button @click="addEditData(false)">行を追加する</button>
            <button @click="resetData">表をリセットする</button>
        </div>
        <div class="wrapper">
            <table border="1">
                <tr>
                    <th style="width: 5rem;">都道府県</th>
                    <th style="width: 10rem;">エリア</th>
                    <th style="width: 5rem;">管理番号</th>
                    <th style="width: 4rem;">状態</th>
                    <th style="width: 20rem;">交差点名称</th>
                    <th style="width: 20rem;">地名板名称</th>
                    <th style="width: 2rem;">公式名称</th>
                    <th style="width: 4rem;">意思決定年度</th>
                    <th style="width: 4rem;">稼働開始年度</th>
                    <th style="width: 4rem;">最終更新年度</th>
                    <th style="width: 10rem;">車灯構成</th>
                    <th style="width: 10rem;">歩灯構成</th>
                    <th style="width: 4rem;">ルーバーの有無</th>
                    <th style="width: 2rem;">音響装置</th>
                    <th style="width: 8rem">緯度経度</th>
                    <th style="width: 10rem">備考</th>
                </tr>
                <tr v-for="(intersection, index) in editedIntersections" :key="index">
                    <td v-if="intersection.addLine === undefined">
                        {{ prefs.find(pref => pref.id == intersection.prefId)?.name }}
                    </td>
                    <td v-else>
                        <select v-model="intersection.prefId">
                            <option :value="null"></option>
                            <option v-for="pref in prefs" :key="pref.id" :value="pref.id">{{ pref.name }}</option>
                        </select>
                    </td>
                    <td><select v-model="intersection.areaId">
                        <option v-for="area in prefs.find(pref => pref.id == intersection.prefId)?.area" :key="area.id" :value="area.id" :selected="area.id == intersection.areaId">{{ area.id }}: {{ area.name }}</option>
                    </select></td>
                    <td><input type="text" v-model="intersection.id" placeholder="必須" /></td>
                    <td><select v-model="intersection.status">
                        <option value="UNKNOWN" :selected="intersection.status == 'UNKNOWN'" :disabled="!superadmin">行方不明{{ !superadmin ? ' (最高管理者専用)' : '' }}</option>
                        <option value="LIVE" :selected="intersection.status == 'LIVE'">現存</option>
                        <option value="GONE" :selected="intersection.status == 'GONE'"><span style="color: red;">廃止</span></option>
                        <option value="MOVE" :selected="intersection.status == 'MOVE'">移管</option>
                        <option value="MERGE" :selected="intersection.status == 'MERGE'">統合</option>
                    </select></td>
                    <td><input type="text" v-model="intersection.name" required placeholder="必須"></td>
                    <td><input type="text" v-model="intersection.sign" placeholder="地名板が存在しない場合は空白"></td>
                    <td><input type="checkbox" v-model="intersection.isOfficialName"></td>
                    <td><select v-model="intersection.decideYear">
                        <option :value="null">（不明）</option>
                        <option v-for="year in [...Array(new Date().getFullYear() - 1900 + 1)].keys().map(i => i + 1900)" :key="year" :value="year">{{ year }}</option>
                    </select></td>
                    <td><select v-model="intersection.operationYear">
                        <option :value="null">（不明）</option>
                        <option v-for="year in [...Array(new Date().getFullYear() - 1900 + 1)].keys().map(i => i + 1900)" :key="year" :value="year">{{ year }}</option>
                    </select></td>
                    <td><select v-model="intersection.refreshYear">
                        <option :value="null">（不明）</option>
                        <option v-for="year in [...Array(new Date().getFullYear() - 1900 + 1)].keys().map(i => i + 1900)" :key="year" :value="year">{{ year }}</option>
                    </select></td>
                    <td><select v-model="intersection.cars" multiple>
                        <option v-for="car in cars" :key="car.id" :value="car.code">{{ car.code }}: {{ car.name }}</option>
                    </select></td>
                    <td><select v-model="intersection.peds" multiple>
                        <option v-for="ped in peds" :key="ped.id" :value="ped.code">{{ ped.code }}: {{ ped.name }}</option>
                    </select></td>
                    <td><select v-model="intersection.rover">
                        <option value="0">なし</option>
                        <option value="1">丸形ルーバーあり</option>
                        <option value="2">四角制限あり</option>
                    </select></td>
                    <td><input type="checkbox" v-model="intersection.sound"></td>
                    <td><input type="text" v-model="intersection.location.y" class="ignore-width" placeholder="緯度">, <input type="text" v-model="intersection.location.x" class="ignore-width" placeholder="経度"><button @click="copyLocation(intersection)">コピー</button><button @click="pasteLocation(intersection)">貼り付け</button></td>
                    <td><input type="text" v-model="intersection.comment" placeholder="任意"></td>
                </tr>
            </table>
        </div>
        <div v-if="editedIntersections.length > 0">
            <button @click="saveEditData(false)">状態を保存する</button>
            <button @click="loadEditData">状態を読み込む</button>
            <button @click="confirmEditData">編集内容を確認する</button>
            <button @click="addEditData(true)">行を追加する</button>
            <button @click="resetData">表をリセットする</button>
        </div>

        <Dialog title="" type="info" v-if="warning != ''">
            <p>{{ warning }}</p>
            <hr>
            <button @click="warning = ''; saveEditData(true)">OK</button>
            <button @click="warning = ''; show('キャンセルされました');">キャンセル</button>
        </Dialog>

        <Dialog title="差分の確認" type="info" v-if="editedDiffs.length != 0" width="90vw" height="90vh">
            <div v-if="!sending && checkResult == null">
                <p>編集件数は<em>{{ editedDiffs.length }}</em>件です。</p>
                <p>内容を確認し、問題ない場合は「OK」をクリックしてください。サーバーでチェックされた後、OKなら反映されます。</p>
                <hr>
                <div class="border" v-for="diff in editedDiffs" :key="diff.edited">
                    <h3 v-if="diff.intersection.prefId == null">新規：{{ diff.edited.prefId }}-{{ diff.edited.areaId }}-{{ diff.edited.id }}「{{ diff.edited.name }}」</h3>
                    <h3 v-else>更新：{{ diff.intersection.prefId }}-{{ diff.intersection.areaId }}-{{ diff.intersection.id }}「{{ diff.intersection.name }}」→　{{ diff.edited.prefId }}-{{ diff.edited.areaId }}-{{ diff.edited.id }}「{{ diff.edited.name }}」</h3>
                    <ul>
                        <li v-for="d in diff.diff" :key="d">{{ d.key }}: {{ d.before ?? '（空）' }} → {{ d.after }}</li>
                    </ul>
                </div>

                <hr>
                <button @click="sendEditData">OK</button>
                <button @click="editedDiffs = []; show('キャンセルされました');">キャンセル</button>
            </div>
            <Loading v-if="sending" timeout="10000" message="サーバー側でチェックをしています……" />
            <div v-if="!sending &&checkResult != null">
                <p>審査チェックぅ</p>
            </div>
        </Dialog>
    </div>
</template>

<style lang="css" scoped>
    table {
        table-layout: auto;
        width: 150rem;
    }

    select, input:not(.ignore-width) {
        width: 100%;
    }

    input {
        display: inline-block;
    }

    div.wrapper {
        overflow-x: scroll;
        width: 100%;
    }

    div.border {
        border: 1px solid gray;
        margin: 0.5rem;
        padding: 0.5rem;
    }
</style>