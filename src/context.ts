import { AsyncLocalStorage } from "node:async_hooks"

const INIT_SYMBOL = Symbol("ContextManager init symbol")

export class ContextManager<Init = void> {
    private als = new AsyncLocalStorage<Map<unknown, unknown>>()

    initValue() {
        const store = this.als.getStore()
        if (!store) {
            throw new Error("please call ContextManager#run first")
        }
        return store.get(INIT_SYMBOL)
    }

    run<T>(fn: () => T, init: Init) {
        const store = new Map<unknown, unknown>([
            [INIT_SYMBOL, init]
        ])
        return this.als.run(store, fn)
    }
    
    create<T>(fn: () => T) {
        return () => {
            const store = this.als.getStore()
            if (!store) {
                throw new Error("please call ContextManager#run first")
            }
            const cached = store.get(fn)
            if (cached) {
                return cached as T
            }
            const result = fn()
            store.set(fn, result)
            return result
        }
    }
}