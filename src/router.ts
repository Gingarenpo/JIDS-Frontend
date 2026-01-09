import { createWebHistory, createRouter } from "vue-router";

import Home from "./pages/Home.vue";
import Error404 from "./pages/common/Error404.vue";
import Test from "./pages/Test.vue";
import conpane from "./routers/conpane";
import front from "./routers/front";
import { useTokenStore } from "./store";
import { getDataFromJWT } from "./helpers/helpers";
import Error403 from "./pages/common/Error403.vue";

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
            // 403 Forbidden
            {
                path: "/403",
                name: "Forbidden",
                component: Error403,
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

        // メタ情報にランクによる制限がある場合、制限を超えている場合は強制ログイン画面へ
        if (store.token !== null && to.meta?.requiresAuth) {
            console.log("aaaaaaaaaa");
            if (to.meta.requiredRank != -1 && getDataFromJWT(store.token).user_rank >= to.meta.requiredRank) {
                return next({ name: "Forbidden" });
            }
            if (to.meta.requiredRank == -1 && getDataFromJWT(store.token).user_rank != -1) {
                return next({ name: "Forbidden" });
            }
            
        }
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