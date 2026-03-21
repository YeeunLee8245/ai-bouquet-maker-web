'use server';
import { cookies } from 'next/headers';

export async function allowMakeBouquet() {
  const cookieStore = await cookies();
  cookieStore.set('make-bouquet-allowed', '1', { maxAge: 10, path: '/' });
}
