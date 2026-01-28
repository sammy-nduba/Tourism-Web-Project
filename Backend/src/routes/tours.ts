import express from 'express';
import { adminService } from '../services/AdminService.js';

const router = express.Router();

// GET /api/tours/admin/all - Get ALL tours (admin only)
router.get('/admin/all', async (req, res) => {
  try {
    const {
      country,
      city,
      limit,
      offset,
      page
    } = req.query;

    const filters: any = {};

    if (country) filters.country = country as string;
    if (city) filters.city = city as string;
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);
    if (page) filters.offset = (parseInt(page as string) - 1) * (filters.limit || 50);

    const tours = await adminService.getTours(filters);

    return res.json(tours);
  } catch (error) {
    console.error('Error fetching admin tours:', error);
    return res.status(500).json({
      error: 'Failed to fetch tours',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tours - List tours with filtering (published only)
router.get('/', async (req, res) => {
  try {
    const {
      country,
      city,
      limit,
      offset,
      featured,
      page
    } = req.query;

    const filters: any = {};

    if (country) filters.country = country as string;
    if (city) filters.city = city as string;
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);
    if (page) filters.offset = (parseInt(page as string) - 1) * (filters.limit || 10);
    if (featured === 'true') filters.featured = true;

    const tours = await adminService.getPublishedTours(filters);

    return res.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return res.status(500).json({
      error: 'Failed to fetch tours',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tours/featured - Get featured tours
router.get('/featured', async (req, res) => {
  try {
    const { limit = '6' } = req.query;
    const tours = await adminService.getFeaturedTours(parseInt(limit as string));
    return res.json(tours);
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return res.status(500).json({
      error: 'Failed to fetch featured tours',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tours/slug/[slug] - Get tour by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const tour = await adminService.getTourBySlug(req.params.slug);

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    return res.json(tour);
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return res.status(500).json({
      error: 'Failed to fetch tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tours/[id] - Get specific tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await adminService.getTour(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    return res.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return res.status(500).json({
      error: 'Failed to fetch tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/tours - Create new tour (admin only)
router.post('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const tourData = req.body;

    if (!tourData.title || !tourData.slug) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title and slug are required'
      });
    }

    const tour = await adminService.createTour(tourData);
    return res.status(201).json(tour);
  } catch (error) {
    console.error('Error creating tour:', error);
    return res.status(500).json({
      error: 'Failed to create tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/tours/[id] - Update tour (admin only)
router.put('/:id', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const updates = req.body;
    const tour = await adminService.updateTour(req.params.id, updates);
    return res.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return res.status(500).json({
      error: 'Failed to update tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/tours/[id] - Delete tour (admin only)
router.delete('/:id', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    await adminService.deleteTour(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return res.status(500).json({
      error: 'Failed to delete tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;