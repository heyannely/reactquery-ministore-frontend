// src/Home.tsx
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../api/axios'

interface Product {
  id: number
  title: string
  price: number
}

export default function Home() {
  const PAGE_SIZE = 10

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get<Product[]>('/products', {
        params: { offset: pageParam, limit: PAGE_SIZE },
      })
      return res.data
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE
        ? allPages.length * PAGE_SIZE
        : undefined,
  })

  if (isLoading) return <p>Loading…</p>
  if (error)     return <p style={{ color: 'red' }}>Error: {error.message}</p>

  return (
    <div style={{ padding: 16 }}>
      <ul>
        {data!.pages.flatMap(page =>
          page.map(p => (
            <li key={p.id}>
              {p.title} — ${p.price}
            </li>
          ))
        )}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        style={{ padding: '8px 16px', marginTop: 16 }}
      >
        {isFetchingNextPage
          ? 'Loading…'
          : hasNextPage
          ? 'Load More'
          : 'No more products'}
      </button>
    </div>
  )
}