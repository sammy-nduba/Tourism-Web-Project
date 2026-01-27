import express from 'express';
import { adminService } from '../services/AdminService.js';

const router = express.Router();

// GET /api/countries - List all countries
router.get('/', async (req, res) => {
  try {
    const countries = await adminService.getCountries();
    return res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return res.status(500).json({
      error: 'Failed to fetch countries',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/countries/[id] - Get specific country with cities
router.get('/:id', async (req, res) => {
  try {
    const country = await adminService.getCountryWithCities(req.params.id);

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    return res.json(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    return res.status(500).json({
      error: 'Failed to fetch country',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/countries/[id]/tours - Get tours for specific country
router.get('/:id/tours', async (req, res) => {
  try {
    const { limit, offset, page } = req.query;

    const filters: any = {
      country: req.params.id
    };

    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);
    if (page) filters.offset = (parseInt(page as string) - 1) * (filters.limit || 10);

    const tours = await adminService.getToursByCountry(filters);
    return res.json(tours);
  } catch (error) {
    console.error('Error fetching country tours:', error);
    return res.status(500).json({
      error: 'Failed to fetch country tours',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;