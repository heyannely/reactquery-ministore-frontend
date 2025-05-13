// src/App.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from './api/axios';

interface Product {
  id: number;
  title: string;
  price: number;
}

export default function App() {
// src/App.tsx
const { data = [], error, isLoading } = useQuery<Product[], Error>({
  queryKey: ['products', 0],
  queryFn: () =>
    api
      .get<Product[]>('/products', {
        params: { offset: 0, limit: 10 },
      })
      .then(res => res.data),
  placeholderData: [],
});
  if (isLoading) return <p>Loading…</p>
  if (error)     return <p style={{ color: 'red' }}>Error: {error.message}</p>

  return (
    <ul>
      <li>hi</li>
      {data!.map((p) => (
        <li key={p.id}>
          {p.title} — ${p.price}
        </li>
      ))}
    </ul>
  )
}