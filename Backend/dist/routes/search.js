import express from 'express';
import { adminService } from '../services/AdminService.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { q, country, city, experience_level, min_price, max_price, limit = '20', offset = '0', page } = req.query;
        if (!q && !country && !city && !experience_level && !min_price && !max_price) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'At least one search parameter is required'
            });
        }
        const filters = {
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
        if (page) {
            filters.offset = (parseInt(page) - 1) * filters.limit;
        }
        if (q)
            filters.query = q;
        if (country)
            filters.country = country;
        if (city)
            filters.city = city;
        if (experience_level)
            filters.experience_level = experience_level;
        if (min_price)
            filters.min_price = parseFloat(min_price);
        if (max_price)
            filters.max_price = parseFloat(max_price);
        const results = await adminService.searchTours(filters);
        return res.json(results);
    }
    catch (error) {
        console.error('Error searching tours:', error);
        return res.status(500).json({
            error: 'Failed to search tours',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
