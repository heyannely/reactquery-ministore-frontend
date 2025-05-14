// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../api/auth'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    // v5 requires `mutationFn` instead of passing the function as first arg
    mutationFn: login,
    onSuccess: ({ access_token }) => {
      // 1. store JWT
      console.log('token', access_token);
      localStorage.setItem('accessToken', access_token)
      // 3. prime or invalidate your `['me']` cache
      queryClient.setQueryData(['me'], user)
    },
    onError: (err: unknown) => {
      console.error('Login failed:', err)
    },
  })
}