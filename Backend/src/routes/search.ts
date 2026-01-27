import express from 'express';
import { adminService } from '../services/AdminService.js';

const router = express.Router();

// GET /api/search - Search tours
router.get('/', async (req, res) => {
  try {
    const {
      q,
      country,
      city,
      experience_level,
      min_price,
      max_price,
      limit = '20',
      offset = '0',
      page
    } = req.query;

    if (!q && !country && !city && !experience_level && !min_price && !max_price) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'At least one search parameter is required'
      });
    }

    const filters: any = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    if (page) {
      filters.offset = (parseInt(page as string) - 1) * filters.limit;
    }

    if (q) filters.query = q as string;
    if (country) filters.country = country as string;
    if (city) filters.city = city as string;
    if (experience_level) filters.experience_level = experience_level as string;
    if (min_price) filters.min_price = parseFloat(min_price as string);
    if (max_price) filters.max_price = parseFloat(max_price as string);

    const results = await adminService.searchTours(filters);

    return res.json(results);
  } catch (error) {
    console.error('Error searching tours:', error);
    return res.status(500).json({
      error: 'Failed to search tours',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;