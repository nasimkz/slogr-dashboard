/**
 * Returns a debounced version of fn that delays invocation by `delay` ms.
 * Repeated calls within the delay window cancel the previous pending call.
 */
export function useDebounceFn(fn, delay = 300) {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
    }
}
