import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import { Tour, TourAvailability } from '../../../domain/models';
import { formatPrice } from '../../../shared/utils';
import { bookingService } from '../../../data/services/BookingService';
import { ROUTES } from '../../../shared/constants';
import { Button } from '../UI/Button';
import { Card, CardContent } from '../UI/Card';

interface BookingWidgetProps {
    tour: Tour;
}

export function BookingWidget({ tour }: BookingWidgetProps) {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<TourAvailability | null>(null);
    const [guests, setGuests] = useState(1);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
    });

    const totalPrice = tour.price.amount * guests;

    const handleDateSelect = (availability: TourAvailability) => {
        setSelectedDate(availability);
    };

    const incrementGuests = () => {
        if (selectedDate && guests < selectedDate.spotsAvailable) {
            setGuests(prev => prev + 1);
        } else if (!selectedDate && guests < tour.maxGroupSize) {
            setGuests(prev => prev + 1);
        }
    };

    const decrementGuests = () => {
        if (guests > 1) {
            setGuests(prev => prev - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBookNow = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        setIsProcessing(true);

        try {
            const booking = await bookingService.createBooking({
                tourId: tour.id,
                tourName: tour.title,
                startDate: selectedDate.startDate,
                endDate: selectedDate.endDate,
                guests,
                totalAmount: totalPrice,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                specialRequests: formData.specialRequests
            });

            // Navigate with booking data in state
            navigate(ROUTES.BOOKING_SUCCESS, { state: { booking } });
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Render Checkout Modal Overlay
    if (showCheckout && selectedDate) {
        return (
            <Card className="sticky top-24 shadow-xl border-emerald-100/50 overflow-hidden">
                <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold">Complete Booking</h3>
                    <button onClick={() => setShowCheckout(false)} className="hover:bg-emerald-700 p-1 rounded">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <CardContent className="p-6 space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4">
                        <p><strong>{tour.title}</strong></p>
                        <p className="text-gray-600">{guests} Guests • {formatPrice(totalPrice)}</p>
                        <p className="text-gray-600">
                            {new Date(selectedDate.startDate).toLocaleDateString()} - {new Date(selectedDate.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <form onSubmit={handleBookNow} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dietary / Special Requests</label>
                            <textarea
                                name="specialRequests"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.specialRequests}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="pt-2">
                            <Button className="w-full" size="lg" disabled={isProcessing}>
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ${formatPrice(totalPrice)}`
                                )}
                            </Button>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                Secure payment powered by Stripe (Mock)
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="sticky top-24 shadow-xl border-emerald-100/50 overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white">
                <p className="text-emerald-100 text-sm font-medium">From</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                        {formatPrice(tour.price.amount)}
                    </span>
                    <span className="text-emerald-100 text-sm">per person</span>
                </div>
            </div>

            <CardContent className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Dates
                    </label>
                    <div className="space-y-2">
                        {tour.availability.map((slot, index) => {
                            const isSelected = selectedDate?.startDate === slot.startDate;
                            const startDate = new Date(slot.startDate).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                            });
                            const endDate = new Date(slot.endDate).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                            });

                            return (
                                <button
                                    key={`${slot.startDate}-${index}`}
                                    onClick={() => handleDateSelect(slot)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected
                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar className={`h-5 w-5 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <div className="text-left">
                                            <p className="font-medium text-sm">{startDate}</p>
                                            <p className="text-xs text-gray-500">to {endDate}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${slot.spotsAvailable > 3 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {slot.spotsAvailable} spots left
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guests
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                        <button
                            onClick={decrementGuests}
                            disabled={guests <= 1}
                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{guests}</span>
                        </div>
                        <button
                            onClick={incrementGuests}
                            disabled={!!selectedDate && guests >= selectedDate.spotsAvailable}
                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <ChevronUp className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                    {selectedDate && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Max {selectedDate.spotsAvailable} guests for this date
                        </p>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{formatPrice(tour.price.amount)} x {guests} guests</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg text-gray-900 border-t border-gray-100 pt-3">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate}
                    onClick={() => setShowCheckout(true)}
                >
                    {selectedDate ? 'Book Now' : 'Select a Date'}
                </Button>

                <div className="flex justify-center gap-4 text-xs text-gray-500 pt-2">
                    <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        <span>Best Price Guarantee</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        <span>Secure Payment</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
