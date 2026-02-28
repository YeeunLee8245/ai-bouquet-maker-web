import axios from 'axios';

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  timeout: 10_000,
});
