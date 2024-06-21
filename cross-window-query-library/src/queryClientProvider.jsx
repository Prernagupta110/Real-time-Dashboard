import * as React from 'react'

const QueryClientContext = React.createContext(undefined)

export const useQueryClient = (queryClient) => {
    const client = React.useContext(QueryClientContext)

    if (queryClient) {
        return queryClient
    }

    if (!client) {
        throw new Error(
            'No QueryClient set, use QueryClientProvider to set one'
        )
    }

    return client
}

export const QueryClientProvider = ({ client, children }) => {
    return (
        <QueryClientContext.Provider value={client}>
            {children}
        </QueryClientContext.Provider>
    )
}
