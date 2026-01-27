import express from 'express';
import { serverAdminService } from '../services/AdminService';

const router = express.Router();

// GET /api/countries - Get all countries
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const countries = await serverAdminService.getCountries();

    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// POST /api/countries - Create a new country
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const countryData = req.body;

    // Validate required fields
    if (!countryData.name || !countryData.code) {
      res.status(400).json({ error: 'Name and code are required' });
      return;
    }

    const country = await serverAdminService.createCountry(countryData);

    res.status(201).json(country);
  } catch (error) {
    console.error('Error creating country:', error);
    res.status(500).json({ error: 'Failed to create country' });
  }
});

export default router;