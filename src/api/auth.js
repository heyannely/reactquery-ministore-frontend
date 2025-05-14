// src/api/auth.js
import {api} from './axios.ts';

/**
 * POST /auth/login
 * body: { email, password }
 * returns: { token, user: { id, email, name… } }
 */
export function login({ email, password }) {
  return api
    .post('/auth/login', { email, password })
    .then(res => res.data);
}
