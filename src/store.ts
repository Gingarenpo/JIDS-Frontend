// piniaを用いてstoreを作成する

import { defineStore } from "pinia";

export const useTokenStore = defineStore("token", {
    state: () => ({
        token: null,
    }),
    actions: {
        logout() {
            this.token = null;
        },
        login(token: string) {
            this.token = token;
        }
    },
    persist: {
        storage: sessionStorage,
    }
});

export const useUploadStore = defineStore("upload", {
   state: () => ({
       done: false,
   }),
   actions: {
        read() {
            this.done = true;
        },
        reRead() {
            this.done = false;
        }
   },
   persist: {
       storage: localStorage,
   }
});

export const useSearchStore = defineStore("search", {
    state: () => ({
        done: false,
    }),
    actions: {
        read() {
            this.done = true;
        },
        reRead() {
            this.done = false;
        }
    },
    persist: {
        storage: localStorage,
    }
});

// セッション確認用ストア（UI表示用）
export const useSessionStore = defineStore("session", {
    state: () => ({
        expired: false,
    }),
    actions: {
        expire() {
            this.expired = true;
        },
        reset() {
            this.expired = false;
        }
    },
    persist: {
        storage: localStorage,
    }
})