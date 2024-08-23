import { createWebHistory, createRouter } from "vue-router";

import Home from "./pages/Home.vue";
import Error404 from "./pages/common/Error404.vue";
import Pref from "./pages/Pref.vue";

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
            component: () => Pref,
        }
    ],
})