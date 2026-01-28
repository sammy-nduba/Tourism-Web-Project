import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, Users, Check, Globe, ChevronLeft, AlertCircle } from 'lucide-react';
import { useTour } from '../hooks/useTours';
import { BookingWidget } from '../components/Tours/BookingWidget';
import { Card, CardContent } from '../components/UI/Card';
import { ROUTES, COUNTRIES } from '../../shared/constants';
import { Skeleton } from '../components/UI/Skeleton';
import { Image } from '../components/UI/Image';

export function TourDetailsPage() {
    const { slug } = useParams<{ slug: string }>();
    const { tour, loading, error } = useTour(slug || '');
    const [activeTab, setActiveTab] = useState<'itinerary' | 'includes' | 'reviews'>('itinerary');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-16">
                {/* Hero Skeleton */}
                <Skeleton className="h-[60vh] min-h-[400px] w-full rounded-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="shadow-lg">
                                <CardContent className="p-8 space-y-4">
                                    <Skeleton className="h-8 w-1/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="shadow-lg h-64">
                                <CardContent className="p-6">
                                    <Skeleton className="h-full w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Adventure Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "We couldn't find the adventure you're looking for."}</p>
                    <Link to={ROUTES.TOURS} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to all adventures
                    </Link>
                </div>
            </div>
        );
    }

    const countryInfo = COUNTRIES[tour.country] || { name: tour.country, code: '', flag: '🌍' };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <Image
                    src={tour.heroImage.url}
                    alt={tour.heroImage.alt}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <Link to={ROUTES.TOURS} className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                            <ChevronLeft className="h-5 w-5 mr-1" />
                            Back to Adventures
                        </Link>
                        <div className="max-w-3xl">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-600/90 text-white text-sm font-medium mb-4 backdrop-blur-sm capitalize">
                                {tour.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                                {tour.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-1.5 text-emerald-400" />
                                    <span>{tour.city}, {countryInfo.name} {countryInfo.flag}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-1.5 text-emerald-400" />
                                    <span>{tour.duration} Days</span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 mr-1.5 text-yellow-400 fill-current" />
                                    <span>{tour.rating} ({tour.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview Card */}
                        <Card className="shadow-lg">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {tour.description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 p-6 bg-gray-50 rounded-xl">
                                    <div className="text-center">
                                        <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                            <Clock className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="text-sm text-gray-500">Duration</div>
                                        <div className="font-semibold text-gray-900">{tour.duration} Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                            <Users className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="text-sm text-gray-500">Group Size</div>
                                        <div className="font-semibold text-gray-900">Max {tour.maxGroupSize}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                            <Globe className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="text-sm text-gray-500">Language</div>
                                        <div className="font-semibold text-gray-900">English</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                            <Users className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="text-sm text-gray-500">Difficulty</div>
                                        <div className="font-semibold text-gray-900 capitalize">{tour.difficultyLevel}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Tabs */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('itinerary')}
                                    className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'itinerary'
                                        ? 'border-emerald-600 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Itinerary
                                </button>
                                <button
                                    onClick={() => setActiveTab('includes')}
                                    className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'includes'
                                        ? 'border-emerald-600 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    What's Included
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'reviews'
                                        ? 'border-emerald-600 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Reviews
                                </button>
                            </div>

                            <div className="p-8">
                                {activeTab === 'itinerary' && (
                                    <div className="space-y-8">
                                        {tour.itinerary.map((day) => (
                                            <div key={day.day} className="relative pl-8 pb-8 last:pb-0 border-l border-emerald-100 last:border-0">
                                                <div className="absolute left-[-10px] top-0 w-5 h-5 rounded-full bg-emerald-600 border-4 border-white shadow-sm" />
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">Day {day.day}: {day.title}</h3>
                                                <p className="text-gray-600 mb-4 text-opacity-90">{day.description}</p>

                                                <div className="space-y-3">
                                                    {day.accommodation && (
                                                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block mr-3">
                                                            <span className="font-semibold mr-1">Accommodation:</span> {day.accommodation}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-wrap gap-2">
                                                        {day.meals.map(meal => (
                                                            <span key={meal} className="text-xs font-medium px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                                                                {meal}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'includes' && (
                                    <div className="space-y-12">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                                                    Included
                                                </h3>
                                                <ul className="space-y-3">
                                                    {tour.includes.map((item, idx) => (
                                                        <li key={idx} className="flex items-start text-gray-600 text-sm">
                                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                                    <div className="w-5 flex justify-center mr-2 text-gray-400 text-lg font-bold">×</div>
                                                    Not Included
                                                </h3>
                                                <ul className="space-y-3">
                                                    {tour.excludes.map((item, idx) => (
                                                        <li key={idx} className="flex items-start text-gray-500 text-sm">
                                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {tour.whatToBring && tour.whatToBring.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-4">What to Bring</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {tour.whatToBring.map((item, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Placeholder for reviews */}
                                {activeTab === 'reviews' && (
                                    <div className="text-center py-8">
                                        <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">Rated {tour.rating}/5 Excellence</h3>
                                        <p className="text-gray-500 mb-6">Based on {tour.reviewCount} customer reviews</p>

                                        <div className="grid gap-6">
                                            {tour.reviews.map(review => (
                                                <div key={review.id} className="bg-gray-50 p-6 rounded-xl text-left">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-gray-900">{review.author}</span>
                                                        <span className="text-xs text-gray-500">{review.date}</span>
                                                    </div>
                                                    <div className="flex text-yellow-400 mb-3 h-4">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">"{review.comment}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Booking Widget */}
                    <div className="lg:col-span-1">
                        <BookingWidget tour={tour} />

                        <div className="mt-8 text-center bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-2">Need a Custom Safari?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                We can tailor-make a trip just for you. Any dates, any group size.
                            </p>
                            <Link to={ROUTES.CONTACT} className="text-emerald-600 text-sm font-semibold hover:underline">
                                Contact our experts &rarr;
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
