import type { ProfileResponse, UpdateProfileParams, UpdateProfileResponse } from '../_types';
import { fetcher } from '@/shared/lib/axios';

export async function fetchMyProfile(): Promise<ProfileResponse> {
  const { data } = await fetcher.get<ProfileResponse>('/api/my/profile');
  return data;
}

export async function updateMyProfile(params: UpdateProfileParams): Promise<UpdateProfileResponse> {
  const { data } = await fetcher.patch<UpdateProfileResponse>('/api/my/profile', params);
  return data;
}
