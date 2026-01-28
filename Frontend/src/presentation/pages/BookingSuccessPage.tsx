import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card, CardContent } from '../components/UI/Card';
import { ROUTES } from '../../shared/constants';
import { Booking } from '../../domain/models';

export function BookingSuccessPage() {
    const location = useLocation();
    const booking = location.state?.booking as Booking;

    if (!booking) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    const startDate = new Date(booking.startDate).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600 text-lg">
                        Thank you, {booking.customerName.split(' ')[0]}. Your adventure is set.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Order Reference: <span className="font-mono font-bold text-gray-700">{booking.id}</span>
                    </p>
                </div>

                <Card className="mb-8 overflow-hidden shadow-lg border-emerald-100">
                    <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
                        <h2 className="font-semibold text-lg">{booking.tourName}</h2>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm backdrop-blur-sm">
                            Confirmed
                        </span>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Start Date</p>
                                    <p className="font-semibold text-gray-900">{startDate}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Guests</p>
                                    <p className="font-semibold text-gray-900">{booking.guests} People</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Meeting Point</p>
                                    <p className="font-semibold text-gray-900">Check your email for details</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="font-bold text-emerald-600 text-lg">$</div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Paid</p>
                                    <p className="font-semibold text-gray-900">USD {booking.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                            </div>
                            <p className="text-sm text-blue-800">
                                A confirmation email has been sent to <strong>{booking.customerEmail}</strong>.
                                One of our travel specialists will reach out within 24 hours to arrange transfers and special requirements.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center space-x-4">
                    <Link to={ROUTES.HOME}>
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                    <Link to={ROUTES.TOURS}>
                        <Button className="flex items-center">
                            Explore More Adventures <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
