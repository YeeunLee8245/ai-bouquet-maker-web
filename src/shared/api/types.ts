export interface IApiError {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
}
