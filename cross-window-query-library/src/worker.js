import { getQueryKeyString } from './utils.js'

// Initialize cache to store query results
const cache = new Map()

// List to store all connected ports for broadcasting
const connectedPorts = []

// TTL settings
const cacheTTL = 60 * 60 * 1000
const checkInterval = 10 * 60 * 1000

// Cache for ongoing queries
const ongoingQueries = new Map()

// Set to track invalidated queries
const invalidatedQueries = new Set()

// Utility function to broadcast a message to all connected ports
const broadcastMessage = (message) => {
    connectedPorts.forEach((port, index) => {
        try {
            port.postMessage(message)
        } catch (error) {
            // If an error occurs (port is closed), remove the port
            connectedPorts.splice(index, 1)
        }
    })
}

// Function to add data to the cache with a timestamp
const addToCache = (key, data) => {
    const now = new Date().getTime()
    cache.set(key, { data, timestamp: now })
}

// Function to start a query with a timeout
const startQuery = (queryKey, timeoutDuration) => {
    const keyString = getQueryKeyString(queryKey)

    if (ongoingQueries.has(keyString)) {
        // Query is already in progress, skip executing it again
        return false
    }

    const timeoutID = setTimeout(() => {
        // Cancel the query if it times out
        broadcastMessage({
            status: 'error',
            error: 'Query timed out',
            queryKey: queryKey,
        })
        ongoingQueries.delete(keyString)
    }, timeoutDuration)

    ongoingQueries.set(keyString, timeoutID)
    return true
}

const invalidateQuery = (queryKey) => {
    const keyString = getQueryKeyString(queryKey)
    invalidatedQueries.add(keyString)
    cache.delete(keyString)

    broadcastMessage({
        status: 'invalidated',
        queryKey: queryKey,
    })
}

// Function to complete a query and clear its timeout
const completeQuery = (queryKey) => {
    const timeoutID = ongoingQueries.get(queryKey)
    if (timeoutID) {
        clearTimeout(timeoutID)
        ongoingQueries.delete(queryKey)
    }
}

// Periodically clear expired cache entries
setInterval(() => {
    const now = new Date().getTime()
    cache.forEach((value, key) => {
        if (now - value.timestamp > cacheTTL) {
            cache.delete(key)
        }
    })
}, checkInterval)

// Function to execute queries
const executeQuery = async (queryScript, queryKey) => {
    const keyString = getQueryKeyString(queryKey)

    // Check if the query is already running to prevent duplicates
    if (!startQuery(queryKey, 30000)) {
        return // Query is already running, don't execute it again
    }
    invalidatedQueries.delete(keyString)
    try {
        const { default: importFn } = await import('/query.config.js')
        const fn = await importFn(queryScript)
        const data = await fn(queryKey) // Pass the queryKey

        // Check if the query has been invalidated during fetching
        if (!invalidatedQueries.has(keyString)) {
            // If not invalidated, proceed to cache and broadcast
            addToCache(keyString, data)
            broadcastMessage({
                status: 'success',
                data: data,
                queryKey: queryKey,
                fromCache: false,
            })
        }
        // If invalidated, do not cache or broadcast
    } catch (error) {
        broadcastMessage({
            status: 'error',
            error: error.message,
            queryKey: queryKey,
        })
    } finally {
        completeQuery(keyString)
    }
}

// Event listener for connections to the shared worker
self.onconnect = (e) => {
    const port = e.ports[0]
    connectedPorts.push(port)

    // Set up event listener for messages from the connected port
    port.onmessage = async (event) => {
        const { queryKey, queryScript, action } = event.data

        //Convert the queryKey array into a string representation
        const keyString = getQueryKeyString(queryKey)

        if (action === 'invalidate') {
            invalidateQuery(queryKey)
        } else {
            // Check cache for existing result
            if (cache.has(keyString)) {
                broadcastMessage({
                    status: 'success',
                    data: cache.get(keyString).data,
                    queryKey: queryKey,
                    fromCache: true,
                })
            } else {
                // If not in cache, execute the query
                executeQuery(queryScript, queryKey)
            }
        }
    }
}
