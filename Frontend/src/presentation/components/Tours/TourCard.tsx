import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Users } from 'lucide-react';
import { TourSummary } from '../../../domain/models/Tour';
import { Card, CardContent } from '../UI/Card';
import { formatPrice } from '../../../shared/utils';
import { COUNTRIES } from '../../../shared/constants';

interface TourCardProps {
  tour: TourSummary;
}

export function TourCard({ tour }: TourCardProps) {
  const countryInfo = COUNTRIES[tour.country];

  return (
    <Card hover>
      <Link to={`/adventures/${tour.slug}`}>
        <div className="relative">
          <img
            src={tour.heroImage.url}
            alt={tour.heroImage.alt}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-emerald-600 text-white px-2 py-1 rounded text-sm font-medium capitalize">
              {tour.category}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-sm font-medium">
              {formatPrice(tour.price.amount)}
            </span>
          </div>
        </div>
        
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {tour.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tour.summary}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{tour.city}, {countryInfo.name} {countryInfo.flag}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{tour.duration} days</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                <span>{tour.rating}</span>
                <span className="ml-1">({tour.reviewCount})</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span className="capitalize">{tour.difficultyLevel}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}