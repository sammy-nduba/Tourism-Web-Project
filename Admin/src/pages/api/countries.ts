import { adminService } from '../../admin/services/AdminService';

export async function GET() {
  try {
    const countries = await adminService.getCountries();

    return new Response(JSON.stringify(countries), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch countries' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const countryData = await request.json();

    // Validate required fields
    if (!countryData.name || !countryData.code) {
      return new Response(JSON.stringify({ error: 'Name and code are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const country = await adminService.createCountry(countryData);

    return new Response(JSON.stringify(country), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating country:', error);
    return new Response(JSON.stringify({ error: 'Failed to create country' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}