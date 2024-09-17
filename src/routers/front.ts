export default {
    routes: [
        // 都道府県検索
        {
            path: "/pref",
            name: "Pref",
            component: () => import("../pages/Prefs.vue"),
        },
        // 地図から検索
        {
            path: "/map",
            name: "Map",
            component: () => import("../pages/MapSearch.vue"),
        },
        // エリア検索
        {
            path: "/:pref/",
            name: "Area",
            component: () => import("../pages/Pref.vue"),
        },
        // 交差点一覧
        {
            path: "/:pref/:area",
            name: "Intersection",
            component: () => import("../pages/Area.vue"),
        },
        // 交差点詳細
        {
            path: "/:pref/:area/:intersection",
            name: "IntersectionDetail",
            component: () => import("../pages/Intersection.vue"),
        }
    ]
}