import { onMounted, onUnmounted } from "vue";
import { isAccessible } from "../helpers/helpers";
import { useSessionStore, useTokenStore } from "../store";

/**
 * 定期的にセッション切れをチェックし、トリガーを発動する
 * @param intervalMs セッション切れを更新する間隔
 */
export function useSessionWatcher(intervalMs = 60_000) {
    const sessionStore = useSessionStore();
    const tokenStore = useTokenStore();
    let timer: number | null = null;

    const check = async () => {
        const ok = await isAccessible();
        if (!ok && tokenStore.token !== null) {
            sessionStore.expire();
        }
    }

    onMounted(() => {
        timer = setInterval(check, intervalMs);
    });
    
    onUnmounted(() => {
        if (timer !== null) {
            clearInterval(timer);
        }
    });
}