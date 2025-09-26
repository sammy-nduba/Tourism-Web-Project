import { Tour, TourSummary } from '../../domain/models';

export const mockTours: Tour[] = [
  {
    id: 'kenya-safari-classic',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'Classic Kenya Safari Experience',
    slug: 'classic-kenya-safari-experience',
    summary: 'Explore the iconic Maasai Mara, witness the Great Migration, and experience authentic Kenyan culture on this unforgettable 7-day adventure.',
    description: 'This comprehensive safari takes you through Kenya\'s most famous wildlife destinations, offering incredible game viewing opportunities and cultural encounters with the Maasai people.',
    category: 'wildlife',
    duration: 7,
    difficultyLevel: 'easy',
    price: {
      amount: 2850,
      currency: 'USD',
      includes: [
        'All accommodation',
        'All meals',
        'Professional guide',
        'Park fees',
        'Transportation',
        'Airport transfers'
      ],
      excludes: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal expenses',
        'Tips'
      ]
    },
    images: [
      {
        id: 'kenya-safari-1',
        url: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
        alt: 'Elephants in Maasai Mara'
      },
      {
        id: 'kenya-safari-2',
        url: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg',
        alt: 'Lions in the wild'
      }
    ],
    heroImage: {
      id: 'kenya-safari-hero',
      url: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
      alt: 'Elephants walking through Kenyan savanna at sunset'
    },
    country: 'kenya',
    city: 'Nairobi',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Nairobi',
        description: 'Welcome to Kenya! Transfer to your hotel and evening briefing.',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'],
        accommodation: 'Nairobi Serena Hotel',
        meals: ['Dinner']
      },
      {
        day: 2,
        title: 'Nairobi to Maasai Mara',
        description: 'Drive to the world-famous Maasai Mara National Reserve.',
        activities: ['Morning drive', 'Afternoon game drive', 'Sundowner'],
        accommodation: 'Mara Safari Camp',
        meals: ['Breakfast', 'Lunch', 'Dinner']
      }
    ],
    includes: [
      'All accommodation (7 nights)',
      'All meals as specified',
      'Professional English-speaking guide',
      'All park entrance fees',
      '4WD safari vehicle with pop-up roof',
      'Airport transfers'
    ],
    excludes: [
      'International airfare',
      'Visa fees ($50 USD)',
      'Travel insurance',
      'Personal expenses',
      'Tips for guides and drivers'
    ],
    whatToBring: [
      'Comfortable safari clothing',
      'Sun hat and sunglasses',
      'Camera and extra batteries',
      'Binoculars',
      'Personal medications'
    ],
    availability: [
      {
        startDate: '2024-06-15',
        endDate: '2024-06-22',
        spotsAvailable: 4,
        totalSpots: 8
      }
    ],
    reviews: [
      {
        id: 'review-1',
        author: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely incredible experience! Our guide was knowledgeable and we saw all of the Big Five.',
        date: '2024-03-15',
        verified: true
      }
    ],
    rating: 4.8,
    reviewCount: 127,
    featured: true,
    maxGroupSize: 8,
    minAge: 12,
    physicalRating: 2,
    tags: ['Big Five', 'Great Migration', 'Cultural', 'Photography']
  },
  {
    id: 'uganda-gorilla-trek',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'Uganda Mountain Gorilla Trekking',
    slug: 'uganda-mountain-gorilla-trekking',
    summary: 'Experience the ultimate wildlife encounter with endangered mountain gorillas in their natural habitat in Bwindi Impenetrable Forest.',
    description: 'This 5-day adventure takes you deep into Uganda\'s pristine forests for an unforgettable encounter with mountain gorillas, one of our planet\'s most endangered species.',
    category: 'wildlife',
    duration: 5,
    difficultyLevel: 'moderate',
    price: {
      amount: 3200,
      currency: 'USD',
      includes: [
        'Gorilla trekking permit',
        'All accommodation',
        'All meals',
        'Professional guide',
        'Transportation'
      ],
      excludes: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal expenses'
      ]
    },
    images: [
      {
        id: 'uganda-gorilla-1',
        url: 'https://images.pexels.com/photos/5471643/pexels-photo-5471643.jpeg',
        alt: 'Mountain gorilla in Uganda forest'
      }
    ],
    heroImage: {
      id: 'uganda-gorilla-hero',
      url: 'https://images.pexels.com/photos/5471643/pexels-photo-5471643.jpeg',
      alt: 'Mountain gorilla in the forests of Uganda'
    },
    country: 'uganda',
    city: 'Kampala',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kampala',
        description: 'Welcome to Uganda, transfer to hotel.',
        activities: ['Airport pickup', 'City briefing'],
        accommodation: 'Kampala Serena Hotel',
        meals: ['Dinner']
      }
    ],
    includes: [
      'Gorilla trekking permit ($700 value)',
      'All accommodation',
      'All meals',
      'Professional guide',
      'Transportation'
    ],
    excludes: [
      'International flights',
      'Uganda visa',
      'Travel insurance',
      'Tips'
    ],
    whatToBring: [
      'Hiking boots',
      'Rain jacket',
      'Long pants',
      'Camera',
      'Water bottle'
    ],
    availability: [
      {
        startDate: '2024-07-10',
        endDate: '2024-07-15',
        spotsAvailable: 2,
        totalSpots: 6
      }
    ],
    reviews: [
      {
        id: 'review-2',
        author: 'Mike Chen',
        rating: 5,
        comment: 'Life-changing experience! The gorilla encounter was absolutely magical.',
        date: '2024-02-28',
        verified: true
      }
    ],
    rating: 4.9,
    reviewCount: 89,
    featured: true,
    maxGroupSize: 6,
    minAge: 15,
    physicalRating: 4,
    tags: ['Mountain Gorillas', 'Conservation', 'Trekking', 'Wildlife']
  }
];

export const mockTourSummaries: TourSummary[] = mockTours.map(tour => ({
  id: tour.id,
  title: tour.title,
  slug: tour.slug,
  summary: tour.summary,
  category: tour.category,
  duration: tour.duration,
  price: tour.price,
  heroImage: tour.heroImage,
  country: tour.country,
  city: tour.city,
  rating: tour.rating,
  reviewCount: tour.reviewCount,
  featured: tour.featured,
  difficultyLevel: tour.difficultyLevel
}));