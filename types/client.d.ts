export interface ApiResponse {
  loading: boolean;
  url: string;
  data: any;
  error?: string | null | boolean;
}
