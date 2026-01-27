import { adminService } from '../../admin/services/AdminService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const country = url.searchParams.get('country');
    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset');

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filters: any = {};
    if (country) filters.country = country;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const tours = await adminService.searchTours(query, filters);

    return new Response(JSON.stringify(tours), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error searching tours:', error);
    return new Response(JSON.stringify({ error: 'Failed to search tours' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}