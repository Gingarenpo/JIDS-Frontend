import { createWebHistory, createRouter } from "vue-router";

import Home from "./pages/Home.vue";
import Error404 from "./pages/common/Error404.vue";
import Prefs from "./pages/Prefs.vue";
import Pref from "./pages/Pref.vue";
import Area from "./pages/Area.vue";
import Intersection from "./pages/Intersection.vue";
import MapSearch from "./pages/MapSearch.vue";

// ルーターの定義
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        // ホーム画面
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        // 404 Not Found
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: Error404,
        },
        // 都道府県検索
        {
            path: "/pref",
            name: "Pref",
            component: Prefs,
        },
        // 地図から検索
        {
            path: "/map",
            name: "Map",
            component: MapSearch,
        },
        // エリア検索
        {
            path: "/:pref/",
            name: "Area",
            component: Pref,
        },
        // 交差点一覧
        {
            path: "/:pref/:area",
            name: "Intersection",
            component: Area,
        },
        // 交差点詳細
        {
            path: "/:pref/:area/:intersection",
            name: "IntersectionDetail",
            component: Intersection,
        }
    ],
})