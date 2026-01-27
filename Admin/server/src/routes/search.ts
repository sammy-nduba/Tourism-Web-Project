import express from 'express';
import { serverAdminService } from '../services/AdminService';

const router = express.Router();

// GET /api/search - Search tours
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const { q, country, limit, offset } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    const filters: any = {};
    if (country) filters.country = country;
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);

    const tours = await serverAdminService.searchTours(q as string, filters);

    res.json(tours);
  } catch (error) {
    console.error('Error searching tours:', error);
    res.status(500).json({ error: 'Failed to search tours' });
  }
});

export default router;