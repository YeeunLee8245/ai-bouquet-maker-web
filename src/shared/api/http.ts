import axios from 'axios';
import type { AxiosError } from 'axios';
import { createClient } from '@/shared/supabase/client';
import type { ApiError } from './types';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach Supabase access token ──
http.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Response: normalize errors into ApiError ──
function toApiError(error: AxiosError<{ code?: string; message?: string; details?: unknown }>): ApiError {
  const res = error.response;

  if (res) {
    return {
      status: res.status,
      code: res.data?.code,
      message: res.data?.message ?? error.message,
      details: res.data?.details,
    };
  }

  // network / timeout
  return {
    message: error.message,
  };
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ code?: string; message?: string; details?: unknown }>) => {
    throw toApiError(error);
  },
);
