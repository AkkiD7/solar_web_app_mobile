import { api, authHeaders, asParams } from './client';

/**
 * Download a CSV file from the super-admin API.
 * B1 fix: Uses try/finally to guarantee blob URL cleanup.
 */
export async function downloadCsv(
  token: string,
  path: string,
  filename: string,
  params?: Record<string, string | number | undefined>
) {
  const response = await api.get<string>(path, {
    headers: authHeaders(token),
    params: params ? asParams(params) : undefined,
    responseType: 'text',
  });

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  try {
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
