import { createWebHistory, createRouter } from "vue-router";

import Home from "./pages/Home.vue";
import Error404 from "./pages/common/Error404.vue";
import Test from "./pages/Test.vue";
import conpane from "./routers/conpane";
import front from "./routers/front";
import { useTokenStore } from "./store";

// ルーターの定義
export const router = createRouter({
        history: createWebHistory(),
        routes: [
            // テスト画面
            {
                path: "/test",
                name: "Test",
                component: Test,
            },
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
    
            // コンパネ
            ...conpane.routes,
    
            // フロント
            ...front.routes,
        ],
    });
    
    router.beforeEach((to, from, next) => {
        const store = useTokenStore();
        // 認証済みの場合は無視
        if (store.token !== null) {
            return next();
        }
    
        // フロントはオールスキップ
        if (front.routes.map((r) => r.name).includes(to.name) || ["Home", "NotFound"].includes(to.name)) {
            return next();
        }

        // ログイン画面などもスキップ
        if (to.name === "conpaneLogin" || to.name === "conpaneSignup" || to.name === "conpanePasswordReissue") {
            return next();
        }
    
        // そうでない場合は強制ログイン画面へ
        return next({ name: "conpaneLogin" });
    });