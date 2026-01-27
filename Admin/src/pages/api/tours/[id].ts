import { adminService } from '../../../admin/services/AdminService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tour = await adminService.getTour(params.id);

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
    console.error('Error fetching tour:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json();
    const tour = await adminService.updateTour(params.id, updates);

    return new Response(JSON.stringify(tour), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    return new Response(JSON.stringify({ error: 'Failed to update tour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await adminService.deleteTour(params.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete tour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}