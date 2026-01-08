import axios from 'axios';

export const fetcher = axios.create({
  timeout: 10_000,
});
