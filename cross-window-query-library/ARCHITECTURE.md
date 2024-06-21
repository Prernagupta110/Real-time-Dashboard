# ARCHITECTURE

## Communication Protocol

### Fetch state request
Request from browser window:
```
{
    action: 'fetch',
    queryScript: string,
    queryKey: array<any>
}
```

Response from worker to all connected browser windows:
```
{
    queryKey: array<any>,
    status: 'error' | 'success',
    data: any?, // not undefined if status is 'success'
    fromCache: boolean?, // not undefined if status is 'success'
    error: string? // not undefined if status is 'error'
}
```

### Cache invalidation request

Request from browser window:
```
{
    action: 'invalidate',
    queryKey: array<any>
}
```

Response from worker to all connected browser windows:
```
{
    queryKey: array<any>,
    status: 'invalidated'
}
```

Windows that are interested in the query key should send fetch request to refetch data.

## Basic file structure
**worker.js**

Entrypoint for the worker. Import (dynamically) the function in the config which can be used to import the scripts. The config is created that way to give hints to Webpack. Implements cache, running queries, reponding to requests and broadcasting changes.

**queryClient.js**

Initializes the shared worker. Provides function for making requests to worker. Query client class should extend [EventTarget](https://medium.com/@zandaqo/eventtarget-the-future-of-javascript-event-systems-205ae32f5e6b). Remember to call `super()` in constructor. When client recieves message from worker dispatch an event with the event name being the query key and the data should be in the event details.

**queryClientProvider.js**

Provider for client.

**useQuery.js**

Get query client with useQueryClient hook. Use query client to fetch the key's data. Listen for data from query client using event listeners. Remember to remove event listeners during unmount. The initial state of a query should be loading until a response is recieved from the worker.
