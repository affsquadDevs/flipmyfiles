export interface ConvertRequest {
  inputFormat: string;
  outputFormat: string;
  options?: Record<string, unknown>;
}

export interface ConvertResponse {
  success: boolean;
  filename?: string;
  size?: number;
  error?: string;
}

export interface FormatListResponse {
  categories: {
    id: string;
    name: string;
    icon: string;
    formats: string[];
  }[];
}

export interface StatsResponse {
  totalConversions: number;
  formatsSupported: number;
}
