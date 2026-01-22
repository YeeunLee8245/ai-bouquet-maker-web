export const CONFIRM_TYPE = {
  Ok: 1,
  Cancel: 2,
} as const;

export type TConfirmType = (typeof CONFIRM_TYPE)[keyof typeof CONFIRM_TYPE];
