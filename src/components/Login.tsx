// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();
  // if the user refreshes and already has a token:
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    // if (token) {
    //   // re-apply header on mount
    //   import('../api/client').then(({ setAuthToken }) =>
    //     setAuthToken(token)
    //   );
    // }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <button type="submit" disabled={loginMutation.isLoading}>
        {loginMutation.isLoading ? 'Logging in…' : 'Log In'}
      </button>

      {loginMutation.isError && (
        <p style={{ color: 'red' }}>
          {loginMutation.error.response?.data?.message
            || loginMutation.error.message}
        </p>
      )}
    </form>
  );
}