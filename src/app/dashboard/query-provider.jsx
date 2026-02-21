'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function QueryProvider({ children }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false
          }
        }
      })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
