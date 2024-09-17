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