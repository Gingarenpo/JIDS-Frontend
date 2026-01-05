<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { onMounted } from 'vue';
    import axios from 'axios';
    import Loading from './Loading.vue';

    // これを使用する親へAPI実行結果を送るためのイベント発火用
    const emit = defineEmits(['search']);

    // 都道府県一覧
    const prefs = ref([]);

    // エリア一覧
    const areas = ref([]);

    // 車灯一覧
    const cars = ref([]);

    // 歩灯一覧
    const peds = ref([]);

    // 詳細検索フラグ
    const detail = ref(false);

    // 現在選択しているもの
    const selectedPref = ref(-1);
    const selectedArea = ref(-1);
    const selectedCars = ref([]);
    const selectedPeds = ref([]);
    const selectedStatus = ref(-1);
    const selectedOpeStart = ref(null);
    const selectedOpeEnd = ref(null);
    const selectedRefStart = ref(null);
    const selectedRefEnd = ref(null);
    const selectedDecStart = ref(null);
    const selectedDecEnd = ref(null);
    const selectedRover = ref([0, 1, 2]);

    // 現在入力されているもの
    const inputedIntersection = ref(null);
    const inputedComment = ref(null);
    
    // チェックボックス関連
    const checkedNormal = ref(true);
    const checkedThumbnail = ref(false);
    const checkedDetail = ref(false);
    const checkedOfficial = ref(false);
    const checkedSound = ref(false);
    const checkedSign = ref(false);

    // 検索時エラーのメッセージ
    const error = ref(null);
    const errorDetail = ref(null);

    // 検索中
    const searching = ref(false);

    // 起動時、都道府県一覧、車灯一覧、歩灯一覧を取得
    onMounted(() => {
        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/")
        .then(response => {
            prefs.value = response.data;
        })
        .catch(error => {
            console.error(error);
        });

        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/metas/codes")
        .then(response => {
            cars.value = response.data.cars;
            peds.value = response.data.peds;
        })
        .catch(error => {
            console.error(error);
        })
    });

    // 都道府県の変更がされたらエリアを再取得
    watch(selectedPref, async () => {
        selectedArea.value = -1;
        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/" + selectedPref.value + "?withArea=true")
        .then(response => {
            areas.value = response.data.area;
        })
        .catch(error => {
            console.error(error);
        });
    });

    // 詳細検索と通常検索の切り替え
    function changeDetail() {
        detail.value = !detail.value;
    }

    // 実際に検索を実行する
    function search() {
        // パラメーターの構築
        const param = {};
        if (detail.value) {
            // 詳細検索の場合

            // 交差点名指定
            if (checkedNormal.value) {
                param.name = inputedIntersection.value;
            }
            else if (checkedSign.value) {
                param.sign = inputedIntersection.value;
            }
            else if (checkedOfficial.value) {
                param.name = inputedIntersection.value;
                param.official = true;
            }

            // 備考欄指定
            param.comment = inputedComment.value;

            // 状態
            if (selectedStatus.value != -1) {
                param.status = selectedStatus.value;
            }

            // 運用開始年度
            let operationYear = "";
            if (selectedOpeStart.value != "" && selectedOpeStart.value != null) {
                operationYear += selectedOpeStart.value;
            }
            if (selectedOpeEnd.value != "" && selectedOpeEnd.value != null) {
                operationYear += "～" + selectedOpeEnd.value;
            }
            if (operationYear != "") {
                param.operationYear = operationYear;
            }

            // 更新開始年度
            let refreshYear = "";
            if (selectedRefStart.value != "" &&  selectedRefStart.value != null) {
                refreshYear += selectedRefStart.value;
            }
            if (selectedRefEnd.value != "" && selectedRefEnd.value != null) {
                refreshYear += "～" + selectedRefEnd.value;
            }
            if (refreshYear != "") {
                param.refreshYear = refreshYear;
            }

            // 開始年度
            let decYear = "";
            if (selectedDecStart.value != "" && selectedDecStart.value != null) {
                decYear += selectedDecStart.value;
            }
            if (selectedDecEnd.value != "" && selectedDecEnd.value != null) {
                decYear += "～" + selectedDecEnd.value;
            }
            if (decYear != "") {
                param.decideYear = decYear;
            }

            // 車灯コード
            if (selectedCars.value.length > 0) {
                param.car = selectedCars.value.join(",");
            }

            // 歩灯コード
            if (selectedPeds.value.length > 0) {
                param.ped = selectedPeds.value.join(",");
            }

            // 都道府県
            if (selectedPref.value != -1) {
                param.pref = selectedPref.value;
            }

            // エリア
            if (selectedArea.value != -1) {
                param.area = selectedArea.value;
            }

            // ルーバー
            if (selectedRover.length > 0) {
                param.rover = selectedRover.value;
            }

            // 音響
            if (checkedSound.value) {
                param.sound = true;
            }

            // 詳細検索
            if (checkedDetail.value) {
                param.detail = true;
            }

            // サムネイル
            if (checkedThumbnail.value) {
                param.thumbnail = true;
            }
            
        }
        else {
            // 簡易検索の場合
            // 交差点名はsign nameどっちも同じ検索
            // 備考欄検索
            // これ以外は絞らない
            param.name = inputedIntersection.value;
            param.comment = inputedComment.value;
        }

        // 指定したパラメーターで結果を取得
        searching.value = true;

        axios.get(import.meta.env.PUBLIC_SERVER_ROOT + "/search", { params: param })
        .then((res) => {
            error.value = null;
            errorDetail.value = null;
            emit("search", res.data);
        })
        .catch((e) => {
            error.value = e.response.data.error;
            if (e.response.data.error == "検索結果が多すぎます。") {
                errorDetail.value = "検索結果が" + e.response.data.count + "件と大量になっています。もう少し絞り込んでください。";
            }
            emit("search", null);
        })
        .finally(() => {
            searching.value = false;
        });
    }

</script>

<template>
    <div v-if="!searching">
        <div class="search-form" v-if="detail">
            <h3>詳細検索</h3>
            <p><label>都道府県</label>：<select v-model="selectedPref">
                <option selected value="-1">すべて</option>
                <option v-for="pref in prefs" :value="pref.id" :key="pref.id">{{ pref.id }}: {{ pref.name }}</option>
            </select></p>
            <p><label>エリア</label>：<select v-model="selectedArea">
                <option value="-1">すべて</option>
                <option v-for="area in areas" :value="area.id" :key="area.id">{{ area.id }}: {{ area.name }}</option>
            </select></p>

            <p><label>交差点名</label>：<input type="text" placeholder="部分一致で検索" v-model="inputedIntersection"></p>
            <p><input type="radio" name="name-type" v-model="checkedNormal" /><label>交差点名を特に絞らずに検索する（デフォルト）</label></p>
            <p><input type="radio" name="name-type" v-model="checkedSign" /><label>交差点名を地名板とみなして検索する</label></p>
            <p><input type="radio" name="name-type" v-model="checkedOfficial" /><label>交差点名を公式名称とみなして検索する</label></p>

            <p><label>交差点の状態</label>：<select v-model="selectedStatus">
                <option selected value="-1">すべて</option>
                <option value="LIVE">現存</option>
                <option value="GONE">廃止</option>
                <option value="MOVE">移管</option>
                <option value="MERGE">統合</option>
                <option value="UNKNOWN">行方不明</option>
            </select></p>
            <p><label>車灯コード</label>：<select multiple v-model="selectedCars">
                <option v-for="car in cars" :value="car.code" :key="car.code">{{ car.code }}: {{ car.name }}</option>
            </select><br><small>※複数選択を行うとOR検索となります</small></p>
            <p><label>歩灯コード</label>：<select multiple v-model="selectedPeds">
                <option v-for="ped in peds" :value="ped.code" :key="ped.code">{{ ped.code }}: {{ ped.name }}</option>
            </select><br><small>※複数選択を行うとOR検索となります</small></p>
            <p><label>意思決定年度</label>：<input type="number" v-model="selectedDecStart">～<input type="number" v-model="selectedDecEnd"><br><small>※上限下限を指定しない場合は未入力にしてください</small></p>
            <p><label>運用開始年度</label>：<input type="number" v-model="selectedOpeStart">～<input type="number" v-model="selectedOpeEnd"><br><small>※上限下限を指定しない場合は未入力にしてください</small></p>
            <p><label>更新年度</label>：<input type="number" v-model="selectedRefStart">～<input type="number" v-model="selectedRefEnd"><br><small>※上限下限を指定しない場合は未入力にしてください</small></p>

            <p><label>ルーバーの有無</label>：<select v-model="selectedRover" multiple>
                <option value="0">なし</option>
                <option value="1">丸形ルーバー</option>
                <option value="2">四角制限</option>
            </select></p>

            <p><label>備考欄</label>：<input type="text" placeholder="部分一致で検索" v-model="inputedComment"></p>

            <p><input type="checkbox" v-model="checkedThumbnail" /><label>サムネイルが存在する</label></p>
            <p><input type="checkbox" v-model="checkedDetail" /><label>現地調査が存在する</label><small>※通常現地調査があればサムネイルはあります</small></p>
            <p><input type="checkbox" v-model="checkedSound" /><label>音響装置が存在する</label></p>

            <p><button @click="changeDetail">簡易検索に切り替える</button> <button @click="search">検索</button></p>

            <div v-if="error != null" class="warn">
                <p>{{ error }}</p>
                <p>{{ errorDetail }}</p>
            </div>

        </div>
        <div v-else class="search-form">
            <h3>簡易検索</h3>
            <p><label>交差点名</label>：<input type="text" placeholder="部分一致で検索" v-model="inputedIntersection"></p>
            <p><label>備考欄</label>：<input type="text" placeholder="部分一致で検索" v-model="inputedComment"></p>

            <p><button @click="changeDetail">詳細検索に切り替える</button> <button @click="search">検索</button></p>

            <div v-if="error != null" class="warn">
                <p>{{ error }}</p>
                <p>{{ errorDetail }}</p>
            </div>
        </div>
    </div>
    <div class="search-form" v-else>
        <Loading message="検索中…" timeout="25000" />
    </div>
</template>


<style scoped>
    .search-form {
        margin: 1rem;
        border: 1px solid var(--border-dark-color);
        padding: 0.5rem;
        background-color: white;
    }
</style>