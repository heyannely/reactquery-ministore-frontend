import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister: localStoragePersister,
      maxAge: 1000 * 60 * 60 * 24, // 24h
    }}
onError={() => {
console.error('Failed to restore React Query cache')
}}
  >
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>
)