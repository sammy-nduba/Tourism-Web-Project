type NetlifyEvent = {
  httpMethod: string;
  path: string;
  rawQuery?: string;
  headers: Record<string, string | undefined>;
  body?: string | null;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000';
const FUNCTION_PREFIX = '/.netlify/functions/api';

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Basic CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      },
      body: '',
    };
  }

  // Map: /.netlify/functions/api/<path>  ->  <BACKEND_URL>/api/<path>
  let path = event.path.startsWith(FUNCTION_PREFIX)
    ? event.path.slice(FUNCTION_PREFIX.length)
    : event.path;
  if (!path.startsWith('/')) path = `/${path}`;

  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = `${BACKEND_URL}/api${path}${queryString}`;

  try {
    const method = event.httpMethod;

    const response = await fetch(url, {
      method,
      headers: {
        // Preserve auth headers if present, but enforce JSON content type for our API
        ...event.headers,
        'Content-Type': 'application/json',
      },
      body: method === 'GET' || method === 'HEAD' ? undefined : event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Backend service unavailable' }),
    };
  }
};
