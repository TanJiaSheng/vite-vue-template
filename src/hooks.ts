import { ref, UnwrapRef } from "vue";

type UpdateFunction<T> = (nextState: UnwrapRef<T>) => UnwrapRef<T>;
function isUpdateFc<T>(
    nextState: UnwrapRef<T> | UpdateFunction<T>
): nextState is UpdateFunction<T> {
    return typeof nextState === "function";
}

export default function useState<T>(initialState: T) {
    const state = ref<T>(initialState);
    const useState = (nextState: UnwrapRef<T> | UpdateFunction<T>) => {
        // 检测传入的是不是函数，如果是函数就把state传给函数，把函数执行返回值赋给重新state
        if (isUpdateFc(nextState)) {
            state.value = nextState(state.value);
        } else {
            state.value = nextState;
        }
    };
    return [state, useState] as const;
}
