import { Booking, CreateBookingDTO } from '../../domain/models';
import { generateId } from '../../shared/utils';

class BookingService {
    async createBooking(bookingData: CreateBookingDTO): Promise<Booking> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success probability (can be adjusted)
        const newBooking: Booking = {
            id: generateId(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentId: `pay_${generateId()}`
        };

        console.log('Booking created:', newBooking);
        return newBooking;
    }
}

export const bookingService = new BookingService();
