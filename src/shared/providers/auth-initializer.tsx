'use client';

import { useUserAuth } from '@/hooks/use-supabase-user';

function AuthInitializer() {
  useUserAuth();
  return null;
}

export default AuthInitializer;
