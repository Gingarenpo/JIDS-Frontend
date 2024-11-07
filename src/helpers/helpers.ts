import { useHead } from "@unhead/vue";
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { useTokenStore } from "../store";

/**
 * 
 * @param title タイトルを指定する
 * @param description 検索エンジンにおける説明文を記載する
 * @param keyword キーワードを指定する
 */
export function setHeader(title?:string, description?:string, keyword?:string, ):void {
    useHead({
        title: title ? title + " - JIDS" : "JIDS - 全日本交差点検索システム",
        meta: [
            { name: "description", content: description },
            { name: "keywords", content: keyword },
        ],
    });
}

export function getDataFromJWT(jwt:string): object | null {
    if (jwt === null || jwt === undefined || jwt === "") return null;
    return JSON.parse(Buffer.from(jwt.split(".")[1], 'base64').toString('utf-8'));
}


/**
 * 主にコンパネで使用する、トークン自動払い出し機能つきaxios
 * トークンの必要性がないときは使わない
 * @param type getかpost
 * @param url アクセスするURL
 * @param param パラメータ
 * @param retryCount 何回目のトライか
 * @returns 
 */
export async function axiosWithJWTToken(type: string,url:string, param?:object, retryCount = 0, obj?:object): Promise<object|null> {
    const store = useTokenStore();
    console.log(store.token);
    if (retryCount == 3) {
        return null; // 無理
    }
    if (!["get", "post"].includes(type)) {
        throw new Error("type must be get or post");
    }
    if (store.token === null) {
        // JWTTokenがそもそも存在しないということはログインしていないので取ることができない
        return null;
    }

    let res;
    try {
        res = await axios({
            method: type,
            url: url,
            data: param,
            headers: {
                "Authorization": `Bearer ${store.token}`
            },
            ...obj
        });
    }
    catch (e:any) {
        if (e.response.status == 401) {
            // 再トークン払い出し
            console.debug("※トークンの期限切れ。再発行します");
            const {cookies} = useCookies();
            const userId = cookies.get("user_id");
            const password = cookies.get("password");
            if (userId === null || password === null) {
                console.debug("!? cookie missing!!!!");
                return null; // ログインできてない
            }
    
            let res;
            try {
                res = await axios.post(import.meta.env.PUBLIC_SERVER_ROOT + "/auth/login", {
                    id: userId,
                    password: password
                });
            }
            catch (e:any) {
                return null;
            }
            store.login(res.data.access_token);
            console.debug("トークン払い出し成功: " + store.token); ;
            return await axiosWithJWTToken(type, url, param, ++retryCount);
        }
        return e.response;
    }

    

    return res;
}


export function logout(): boolean {
    const {cookies} = useCookies();
    useTokenStore().logout();
    cookies.remove("user_id");
    cookies.remove("password");
    return true;
}


// Byte単位変換するヤツ
// これ専用のライブラリってないものなのか
export function formatByte(size: number): string {
    if (size < 1024) {
        return (Math.round(size * 100) / 100).toLocaleString() + "Byte";
    }
    else if (size < 1024 * 1024) {
        return (Math.round(size / 1024 * 100) / 100).toLocaleString() + "KB";
    }
    else if (size < 1024 * 1024 * 1024) {
        return (Math.round(size / 1024 / 1024 * 100) / 100).toLocaleString() + "MB";
    }
    else {
        return (Math.round(size / 1024 / 1024 / 1024 * 100) / 100).toLocaleString() + "GB";
    }
}

// 日付変換
export function formatDate(date: String): string | null {
    if (date === null || date === undefined) return null;
    const d = new Date(date);
    return d.getFullYear() + '/' + ('00' + (d.getMonth() + 1)).slice(-2) + '/' + ('00' + d.getDate()).slice(-2) + ' ' + ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2) + ':' + ('00' + d.getSeconds()).slice(-2);
}


// スマホ判別
export function isMobile(): boolean {
    return window.matchMedia && window.matchMedia("(max-width: 800px)").matches;
}