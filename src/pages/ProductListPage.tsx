// src/pages/ProductListPage.tsx
import React, { useState, useRef, useEffect } from 'react'
import {
  useInfiniteQuery,
  useQuery,
  useIsFetching,
} from '@tanstack/react-query'
import { api } from '../api/axios'

export default function ProductListPage() {
  // — Inline types —
  type Category = { id: number; name: string; slug: string }
  type Product  = { id: number; title: string; price: number }

  const isFetchingGlobal = useIsFetching()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [selectedCategory, setSelectedCategory] = useState('')

  // — Simple 500ms debounce for search —
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(h)
  }, [search])

  // — Load categories once, cache 1d —
  const { data: categories = [] } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () =>
      api.get<Category[]>('/categories').then(r => r.data),
    staleTime: 1000 * 60 * 60 * 24,
  })

  // — Infinite product list —
  const PAGE_SIZE = 10
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Product[], Error>({
    queryKey: ['products', debouncedSearch, selectedCategory],
    queryFn: ({ pageParam = 0 }) => {
      const params: Record<string, any> = {
        offset: pageParam,
        limit: PAGE_SIZE,
      }
      if (debouncedSearch)     params.title    = debouncedSearch
      if (selectedCategory)    params.category = selectedCategory

      return api
        .get<Product[]>('/products', { params })
        .then(r => r.data)
    },
    getNextPageParam: (last, pages) =>
      last.length === PAGE_SIZE ? pages.length * PAGE_SIZE : undefined,
  })

  // — IntersectionObserver for infinite scroll —
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    obs.observe(loadMoreRef.current)
    return () => obs.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div style={{ padding: 16 }}>
      {/* Global loader */}
      {isFetchingGlobal ? (
        <div style={{
          position: 'fixed', top: 0, width: '100%',
          background: '#e0f7fa', textAlign: 'center',
        }}>
          Loading…
        </div>
      ) : null}

      {/* Search & Category Filter */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ marginRight: 8, padding: 4 }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ padding: 4 }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      {isLoading ? (
        <p>Loading products…</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <>
          <ul>
            {data!.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.map((p) => (
                  <li key={p.id}>
                    {p.title} — ${p.price}
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>

          {/* Sentinel for infinite scroll */}
          <div ref={loadMoreRef} style={{ height: 1 }} />

          {/* Feedback */}
          {isFetchingNextPage && <p>Loading more…</p>}
          {!hasNextPage && <p>No more products.</p>}
        </>
      )}
    </div>
  )
}