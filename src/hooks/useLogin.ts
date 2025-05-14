// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ access_token /*, user */ }) => {
      // 1. store JWT
      localStorage.setItem('accessToken', access_token)

      // 2. prime or invalidate your `['me']` cache
      // queryClient.setQueryData(['me'], user)
      // or
      // queryClient.invalidateQueries(['me'])

      // 3. navigate to your product list page
      // adjust the path to match however you’ve routed `ProductListPage.tsx`
      navigate('/products')
    },
    onError: (err: unknown) => {
      console.error('Login failed:', err)
    },
  })
}