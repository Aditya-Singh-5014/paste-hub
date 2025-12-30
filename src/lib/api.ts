import type {
  CreatePasteRequest,
  CreatePasteResponse,
  ErrorResponse,
  FetchPasteResponse
} from './types';

function getBaseUrl() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!rawBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  }
  return rawBaseUrl.replace(/\/+$/, '');
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

export async function createPaste(
  data: CreatePasteRequest
): Promise<CreatePasteResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/pastes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorBody = await parseJson<ErrorResponse>(response).catch(
      () => ({ error: 'Request failed' } as ErrorResponse)
    );
    throw new ApiError(response.status, errorBody.error, errorBody.details);
  }

  return parseJson<CreatePasteResponse>(response);
}

export async function fetchPaste(id: string): Promise<FetchPasteResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await parseJson<ErrorResponse>(response).catch(
      () => ({ error: 'Request failed' } as ErrorResponse)
    );
    throw new ApiError(response.status, errorBody.error, errorBody.details);
  }

  return parseJson<FetchPasteResponse>(response);
}
