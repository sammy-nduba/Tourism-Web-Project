import { adminService } from '../../admin/services/AdminService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    const city = url.searchParams.get('city');
    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset');
    const featured = url.searchParams.get('featured');

    const filters: any = {};
    if (country) filters.country = country;
    if (city) filters.city = city;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);
    if (featured === 'true') filters.featured = true;

    const tours = await adminService.getPublishedTours(filters);

    return new Response(JSON.stringify(tours), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tours' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const tourData = await request.json();

    // Validate required fields
    if (!tourData.title || !tourData.slug) {
      return new Response(JSON.stringify({ error: 'Title and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tour = await adminService.createTour(tourData);

    return new Response(JSON.stringify(tour), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating tour:', error);
    return new Response(JSON.stringify({ error: 'Failed to create tour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}