import express from 'express';
import { adminService } from '../services/AdminService.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { country, city, limit, offset, featured, page } = req.query;
        const filters = {};
        if (country)
            filters.country = country;
        if (city)
            filters.city = city;
        if (limit)
            filters.limit = parseInt(limit);
        if (offset)
            filters.offset = parseInt(offset);
        if (page)
            filters.offset = (parseInt(page) - 1) * (filters.limit || 10);
        if (featured === 'true')
            filters.featured = true;
        const tours = await adminService.getPublishedTours(filters);
        return res.json(tours);
    }
    catch (error) {
        console.error('Error fetching tours:', error);
        return res.status(500).json({
            error: 'Failed to fetch tours',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/featured', async (req, res) => {
    try {
        const { limit = '6' } = req.query;
        const tours = await adminService.getFeaturedTours(parseInt(limit));
        return res.json(tours);
    }
    catch (error) {
        console.error('Error fetching featured tours:', error);
        return res.status(500).json({
            error: 'Failed to fetch featured tours',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const tour = await adminService.getTour(req.params.id);
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        return res.json(tour);
    }
    catch (error) {
        console.error('Error fetching tour:', error);
        return res.status(500).json({
            error: 'Failed to fetch tour',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const tourData = req.body;
        if (!tourData.title || !tourData.slug) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Title and slug are required'
            });
        }
        const tour = await adminService.createTour(tourData);
        return res.status(201).json(tour);
    }
    catch (error) {
        console.error('Error creating tour:', error);
        return res.status(500).json({
            error: 'Failed to create tour',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const tour = await adminService.updateTour(req.params.id, updates);
        return res.json(tour);
    }
    catch (error) {
        console.error('Error updating tour:', error);
        return res.status(500).json({
            error: 'Failed to update tour',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await adminService.deleteTour(req.params.id);
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting tour:', error);
        return res.status(500).json({
            error: 'Failed to delete tour',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
