import { TMainResponse } from '../_types';
import { MAIN_DATA_REVALIDATE_TIME } from '../page';

export async function getMainData(): Promise<TMainResponse['data'] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/main`, {
      next: { revalidate: MAIN_DATA_REVALIDATE_TIME },
    });
    if (!res.ok) {
      return null;
    }
    const json: TMainResponse = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
