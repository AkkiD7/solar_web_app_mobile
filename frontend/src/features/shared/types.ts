/** Standard API response wrapper */
export interface ApiEnvelope<T> {
  success?: boolean;
  data: T;
  message?: string;
}

/** Standard paginated response */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
