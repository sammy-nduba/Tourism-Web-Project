import express from 'express';
import { adminService } from '../services/AdminService.js';
import { sendBookingNotification } from '../services/mailService.js';

const router = express.Router();

// POST /api/bookings — create a booking
router.post('/', async (req, res) => {
  try {
    const {
      tourId, tourName, startDate, endDate,
      guests, totalAmount,
      customerName, customerEmail, customerPhone,
      specialRequests,
    } = req.body;

    if (!tourId || !customerName || !customerEmail || !startDate || !endDate || !guests) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'tourId, customerName, customerEmail, startDate, endDate, and guests are required',
      });
    }

    const booking = await adminService.createBooking({
      tour_id: tourId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      start_date: startDate,
      end_date: endDate,
      guests,
      total_amount: totalAmount,
      special_requests: specialRequests,
    });

    // Send email notification in the background
    sendBookingNotification({
      tour_name: tourName,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      start_date: startDate,
      end_date: endDate,
      guests,
      total_amount: totalAmount,
      special_requests: specialRequests,
    }).catch((err) => {
      console.error('Background booking notification failed:', err);
    });

    return res.status(201).json({
      id: booking.id,
      tourName,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      startDate: booking.start_date,
      endDate: booking.end_date,
      guests: booking.guests,
      totalAmount: booking.total_amount,
      status: booking.status,
      createdAt: booking.created_at,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/bookings — list all bookings (admin)
router.get('/', async (_req, res) => {
  try {
    const bookings = await adminService.getBookings();
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
