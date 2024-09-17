export default {
    routes: [
        {
            path: "/conpane/login",
            name: "conpaneLogin",
            component: () => import("../pages/conpane/Login.vue"),
        },

        {
            path: "/conpane",
            name: "conpaneTop",
            component: () => import("../pages/conpane/Top.vue"),
        },

        {
            path: "/conpane/signup",
            name: "conpaneSignup",
            component: () => import("../pages/conpane/SignUp.vue"),
        },

        {
            path: "/conpane/password-reissue",
            name: "conpanePasswordReissue",
            component: () => import("../pages/conpane/PasswordReissue.vue"),
        },

        {
            path: "/conpane/upload",
            name: "conpaneUpload",
            component: () => import("../pages/conpane/Upload.vue"),
        },

        // Not Found
        {
            path: "/conpane/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("../pages/common/Error404.vue"),
        }
    ]
}