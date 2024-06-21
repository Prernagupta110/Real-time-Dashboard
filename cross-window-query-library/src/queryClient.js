import { getQueryKeyString } from './utils'

export class QueryClient extends EventTarget {
    constructor() {
        super()
        this.worker = new SharedWorker(
            /* webpackChunkName: "query-worker" */ new URL(
                './worker.js',
                import.meta.url
            ),
            { type: 'module' }
        )

        this.worker.port.onmessage = (event) => {    
            if (event.data.status == 'invalidated') {
                this.dispatchEvent(
                    new CustomEvent(getQueryKeyString(event.data.queryKey), {
                        detail: {
                            status: 'invalidated',
                        },
                    })
                )
            }
            const { action, status, data, error, queryKey, fromCache } =
                event.data
            this.dispatchEvent(
                new CustomEvent(getQueryKeyString(queryKey), {
                    detail: {
                        action,
                        status,
                        data,
                        error,
                        fromCache,
                    },
                })
            )
        }
        const errorHandler = (event) => {
            console.log('Query failed', event)
        }
        this.worker.onerror = errorHandler
        this.worker.port.onmessageerror = errorHandler
        this.worker.port.start()
    }

    sendFetchRequest(queryScript, queryKey) {
        this.worker.port.postMessage({
            action: 'fetch',
            queryScript,
            queryKey,
        })
    }

    invalidateQuery(queryKey) {
        this.worker.port.postMessage({
            action: 'invalidate',
            queryKey,
        })
    }
}
