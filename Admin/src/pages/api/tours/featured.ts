import { adminService } from '../../../admin/services/AdminService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '6';

    const tours = await adminService.getFeaturedTours(parseInt(limit));

    return new Response(JSON.stringify(tours), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch featured tours' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}