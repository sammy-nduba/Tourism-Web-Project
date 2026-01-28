import { BaseEntity } from '../../shared/types';

export interface Booking extends BaseEntity {
    tourId: string;
    tourName: string;
    startDate: string;
    endDate: string;
    guests: number;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentId: string;
}

export interface CreateBookingDTO {
    tourId: string;
    tourName: string;
    startDate: string;
    endDate: string;
    guests: number;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
}
