# cross-window-query-library

## Description
cross-window-query-library is a state management library. While state management libraries usually allow sharing state between components in a web application, this library aims to share state across all browser windows that are from the same origin.

## Installation

### Config
**query.config.js**
```
export default async function(filename) {
    const { default: defaultFn } = await import("./src/actions/${filename}.js")
    return defaultFn
}
```

### Client
```
import {
  QueryClient,
  QueryClientProvider,
} from 'cross-window-query-library'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}
```

## Usage

### Queries
```
import { useQuery } from 'cross-window-query-library'

const { isLoading, isError, status, data, error } = useQuery({
    queryKey: ['todos'], 
    queryScript: 'getTodos' 
})
```

**src/actions/getTodos.js**
```
export default async function() {
  const response = await fetch('/api/todos')
  return await response.json()
}
```

### Dependent queries
```
import { useState } from 'react'
import { useQuery } from 'cross-window-query-library'

const [selectedTodoId, setSelectedTodoId] = useState(null)

const { isLoading, isError, status, data, error } = useQuery({
    queryKey: ['todo',selectedTodoId], 
    queryScript: 'getTodo',
    enabled: selectedTodoId
})
```

**src/actions/getTodo.js**
```
export default async function(key) {
  const response = await fetch('/api/todos/${key[1]}')
  return await response.json()
}
```

### Query invalidation
```
import { useQueryClient } from 'cross-window-query-library'

const queryClient = useQueryClient()

queryClient.invalidateQuery(['todos'])
```

## Contributing
See [CONTRIBUTING.md](https://version.aalto.fi/gitlab/www-application/cross-window-query-library/-/blob/main/CONTRIBUTING.md)
