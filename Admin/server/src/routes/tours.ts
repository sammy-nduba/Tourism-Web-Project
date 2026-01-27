import express from 'express';
import { serverAdminService } from '../services/AdminService';


const router = express.Router();

// GET /api/tours - Get published tours with optional filters
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const { country, city, limit, offset, featured } = req.query;

    const filters: any = {};
    if (country) filters.country = country;
    if (city) filters.city = city;
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);
    if (featured === 'true') filters.featured = true;

    const tours = await serverAdminService.getPublishedTours(filters);

    res.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// POST /api/tours - Create a new tour
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    console.log('POST /api/tours called');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const tourData = req.body;

    // Validate required fields
    if (!tourData.title || !tourData.slug) {
      console.error('Validation failed: missing title or slug');
      res.status(400).json({ error: 'Title and slug are required' });
      return;
    }

    console.log('Creating tour with data:', tourData);
    const tour = await serverAdminService.createTour(tourData);

    console.log('Tour created successfully:', tour);
    res.status(201).json(tour);
  } catch (error) {
    console.error('Error creating tour - Full error object:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error;

    res.status(500).json({
      error: 'Failed to create tour',
      details: errorMessage,
      fullError: errorDetails
    });
  }
});

// GET /api/tours/featured - Get featured tours
router.get('/featured', async (req: express.Request, res: express.Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const tours = await serverAdminService.getFeaturedTours(limit);

    res.json(tours);
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    res.status(500).json({ error: 'Failed to fetch featured tours' });
  }
});

// GET /api/tours/:id - Get a specific tour by ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const tourId = req.params.id;
    if (!tourId) {
      res.status(400).json({ error: 'Tour ID is required' });
      return;
    }

    const tour = await serverAdminService.getTour(tourId);

    if (!tour) {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }

    res.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// PUT /api/tours/:id - Update a tour
router.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const tourId = req.params.id;
    if (!tourId) {
      res.status(400).json({ error: 'Tour ID is required' });
      return;
    }

    const updates = req.body;
    const tour = await serverAdminService.updateTour(tourId, updates);

    res.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ error: 'Failed to update tour' });
  }
});

// DELETE /api/tours/:id - Delete a tour
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const tourId = req.params.id;
    if (!tourId) {
      res.status(400).json({ error: 'Tour ID is required' });
      return;
    }

    await serverAdminService.deleteTour(tourId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: 'Failed to delete tour' });
  }
});

// GET /api/tours/slug/:slug - Get a tour by slug
router.get('/slug/:slug', async (req: express.Request, res: express.Response) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      res.status(400).json({ error: 'Tour slug is required' });
      return;
    }

    const tour = await serverAdminService.getTourBySlug(slug);

    if (!tour) {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }

    res.json(tour);
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

export default router;