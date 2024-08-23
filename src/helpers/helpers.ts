import { useHead } from "@unhead/vue";

/**
 * 
 * @param title タイトルを指定する
 * @param description 検索エンジンにおける説明文を記載する
 * @param keyword キーワードを指定する
 */
export function setHeader(title?:string, description?:string, keyword?:string, ):void {
    useHead({
        title: title ? title + " - JIDS" : "JIDS",
        meta: [
            { name: "description", content: description },
            { name: "keywords", content: keyword },
        ],
    });
}