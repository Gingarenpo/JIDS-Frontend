<script lang="ts" setup>
    import HelpSearch from '../../components/common/HelpSearch.vue';
    import IntersectionSearchForm from '../../components/common/IntersectionSearchForm.vue';
    import { getAllPrefs, setHeader } from '../../helpers/helpers';
    import { useSearchStore } from '../../store';
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import Dialog from '../../components/common/Dialog.vue';
    import { useToast } from '../../composables/useToast';

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
    onMounted(() => {
        getAllPrefs(prefs);
        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/metas/codes")
        .then(response => {
            cars.value = response.data.cars;
            peds.value = response.data.peds;
        })
        .catch(error => {
            console.error(error);
        })
    })


    setHeader("予備調査");

    // 検索後、フォームを表示するためのデータ整形
    function getSearchData(values) {
        intersections.value = values;
        editedIntersections.value = values;
    }

    // 状態をLocalStorageに保存したりする関数
    function loadEditData() {
        if (localStorage.getItem("editedIntersections") == null) {
            // 保存された状態が存在しない場合
            show("状態が保存されていません！");
        }
        else {
            editedIntersections.value = JSON.parse(localStorage.getItem("editedIntersections"));
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
            show("状態を保存しました。");
        }
    }

    function confirmEditData() {
        
    }

    // 行を追加する（デフォルトで）
    function addEditData() {
        editedIntersections.value.push({
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
        });
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
            <button @click="addEditData">行を追加する</button>
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
                <tr v-for="intersection in editedIntersections" :key="intersection.prefId + intersection.areaId + intersection.id">
                    <td v-if="intersection.addLine === undefined">
                        {{ prefs.find(pref => pref.id == intersection.prefId)?.name }}
                    </td>
                    <td v-else>
                        <select v-model="intersection.prefId">
                            <option v-for="pref in prefs" :key="pref.id" :value="pref.id">{{ pref.name }}</option>
                        </select>
                    </td>
                    <td><select>
                        <option v-for="area in prefs.find(pref => pref.id == intersection.prefId)?.area" :key="area.id" :value="area.id" :selected="area.id == intersection.areaId">{{ area.id }}: {{ area.name }}</option>
                    </select></td>
                    <td><input type="text" v-model="intersection.id" placeholder="必須" /></td>
                    <td><select v-model="intersection.status">
                        <option value="UNKNOWN" :selected="intersection.status == 'UNKNOWN'">行方不明</option>
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
                    <td><input type="text" v-model="intersection.location.y" class="ignore-width">, <input type="text" v-model="intersection.location.x" class="ignore-width"></td>
                    <td><input type="text" v-model="intersection.comment"></td>
                </tr>
            </table>
        </div>
        <div v-if="editedIntersections.length > 0">
            <button @click="saveEditData(false)">状態を保存する</button>
            <button @click="loadEditData">状態を読み込む</button>
            <button @click="confirmEditData">編集内容を確認する</button>
            <button @click="addEditData">行を追加する</button>
        </div>

        <Dialog title="" type="info" v-if="warning != ''">
            <p>{{ warning }}</p>
            <hr>
            <button @click="warning = ''; saveEditData(true)">OK</button>
            <button @click="warning = ''; show('キャンセルされました');">キャンセル</button>
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
</style>