import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Mountain } from 'lucide-react';
import { Country } from '../../../domain/models/Country';
import { Card, CardContent } from '../UI/Card';

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <Card hover>
      <Link to={`/adventures/${country.slug}`}>
        <div className="relative">
          <img
            src={country.heroImage.url}
            alt={country.heroImage.alt}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-lg font-medium">
              {country.flag}
            </span>
          </div>
        </div>
        
        <CardContent>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {country.name}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {country.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{country.capital}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                <span>{country.tourCount} adventures</span>
              </div>
              
              <div className="flex items-center">
                <Mountain className="h-4 w-4 mr-2" />
                <span>{country.cityCount} destinations</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
            <div className="flex flex-wrap gap-1">
              {country.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs"
                >
                  {highlight}
                </span>
              ))}
              {country.highlights.length > 3 && (
                <span className="text-emerald-600 text-xs font-medium">
                  +{country.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}