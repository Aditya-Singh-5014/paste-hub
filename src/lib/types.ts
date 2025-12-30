export type PasteLanguage =
  | 'text'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'sql'
  | 'bash';

export interface CreatePasteRequest {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
  language?: PasteLanguage;
}

export interface CreatePasteResponse {
  id: string;
  url: string;
}

export interface FetchPasteResponse {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
  language: PasteLanguage;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}
