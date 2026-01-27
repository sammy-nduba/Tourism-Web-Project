import { Handler } from '@netlify/functions';

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000';

const handler: Handler = async (event) => {
  // Extract the path after /api/
  const path = event.path.replace('/.netlify/functions/api', '');
  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  
  const url = `${BACKEND_URL}${path}${queryString}`;

  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        'Content-Type': 'application/json',
      },
      body: event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Backend service unavailable' }),
    };
  }
};

export { handler };
