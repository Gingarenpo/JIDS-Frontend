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

        {
            path: "/conpane/me",
            name: "conpaneMe",
            component: () => import("../pages/conpane/Me.vue"),
        },

        {
            path: "/conpane/jae",
            name: "conpaneJae",
            component: () => import("../pages/conpane/JAE.vue"),
        },

        {
            path: "/conpane/queue/:id",
            name: "conpaneQueue",
            component: () => import("../pages/conpane/Queue.vue"),
        },

        {
            path: "/conpane/admin/queues",
            name: "conpaneQueues",
            component: () => import("../pages/conpane/admin/Queues.vue"),
        },

        {
            path: "/conpane/admin",
            name: "conpaneAdmin",
            component: () => import("../pages/conpane/Admin.vue"),
        },

        {
            path: "/conpane/search",
            name: "conpaneSearch",
            component: () => import("../pages/conpane/Search.vue"),
        },

        // Not Found
        {
            path: "/conpane/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("../pages/common/Error404.vue"),
        }
    ]
}