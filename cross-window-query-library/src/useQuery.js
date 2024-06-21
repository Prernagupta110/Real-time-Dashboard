import { useEffect, useMemo, useState, useRef } from 'react'
import { useQueryClient } from './queryClientProvider'
import { getQueryKeyString } from './utils'

export function useQuery(props) {
    const { queryKey, queryScript } = useRef(props).current
    const enabled = props.enabled
    const [queryData, setQueryData] = useState({ status: 'loading' })

    const query = useMemo(
        () => ({
            isLoading: queryData.status === 'loading',
            isError: queryData.status === 'error',
            status: queryData.status,
            data: queryData.data || null,
            error: queryData.error || null,
        }),
        [queryData]
    )
    const client = useQueryClient()

    useEffect(() => {
        if (typeof enabled !== 'undefined' && !enabled) {
            setQueryData({ status: 'loading' })
            return
        }
        const handleEvent = (event) => {
            if (event.detail.status === 'invalidated') {
                client.sendFetchRequest(queryScript, queryKey)
                setQueryData({ status: 'loading' })
            } else setQueryData(event.detail)
        }
        const queryKeyString = getQueryKeyString(queryKey)
        if (!client) {
            throw Error('No query client set')
        }
        client.addEventListener(queryKeyString, handleEvent)
        client.sendFetchRequest(queryScript, queryKey)
        return () => {
            client.removeEventListener(queryKeyString, handleEvent)
        }
    }, [client, queryKey, queryScript, enabled])

    return query
}
