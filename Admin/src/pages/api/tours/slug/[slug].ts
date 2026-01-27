import { adminService } from '../../../../admin/services/AdminService';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const tour = await adminService.getTourBySlug(params.slug);

    if (!tour) {
      return new Response(JSON.stringify({ error: 'Tour not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(tour), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}