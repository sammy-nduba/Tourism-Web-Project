import { Tour, TourSummary } from '../../domain/models/Tour';

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
    difficultyLevel: 'Budget',
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
    difficultyLevel: 'Luxury',
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
  },
  {
    id: 'classic-bush-adventure',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'Classic Bush',
    slug: 'classic-bush-adventure',
    summary: 'Experience the authentic African bush with traditional safari adventures, wildlife encounters, and cultural immersion in pristine wilderness areas.',
    description: 'This classic bush adventure takes you deep into the heart of the African wilderness, offering unparalleled wildlife viewing opportunities and authentic cultural experiences with local communities.',
    category: 'wildlife',
    duration: 8,
    difficultyLevel: 'Comfort',
    price: {
      amount: 3200,
      currency: 'USD',
      includes: [
        'All accommodation in luxury tented camps',
        'All meals and beverages',
        'Professional safari guide',
        'Game drives in 4x4 vehicles',
        'Park fees and conservation contributions',
        'Airport transfers'
      ],
      excludes: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal expenses',
        'Gratuities'
      ]
    },
    images: [
      {
        id: 'classic-bush-1',
        url: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
        alt: 'African savanna landscape'
      },
      {
        id: 'classic-bush-2',
        url: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg',
        alt: 'Wildlife in natural habitat'
      }
    ],
    heroImage: {
      id: 'classic-bush-hero',
      url: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
      alt: 'Classic African bush safari scene'
    },
    country: 'kenya',
    city: 'Nairobi',
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Bush Welcome',
        description: 'Arrive in Nairobi and transfer to your luxury bush camp for an authentic welcome.',
        activities: ['Airport pickup', 'Bush camp orientation', 'Sundowner drinks'],
        accommodation: 'Luxury Tented Camp',
        meals: ['Dinner']
      },
      {
        day: 2,
        title: 'Morning Game Drive',
        description: 'Early morning game drive to witness wildlife at its most active.',
        activities: ['Early morning safari', 'Bush breakfast', 'Afternoon game drive'],
        accommodation: 'Luxury Tented Camp',
        meals: ['Breakfast', 'Lunch', 'Dinner']
      }
    ],
    includes: [
      'Luxury tented accommodation',
      'All meals and local beverages',
      'Professional safari guide',
      'Game drives in open 4x4 vehicles',
      'All park and conservation fees',
      'Airport transfers'
    ],
    excludes: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Personal expenses',
      'Gratuities for staff'
    ],
    whatToBring: [
      'Neutral colored safari clothing',
      'Comfortable walking shoes',
      'Sun protection (hat, sunscreen)',
      'Camera and binoculars',
      'Personal medications'
    ],
    availability: [
      {
        startDate: '2024-06-01',
        endDate: '2024-06-08',
        spotsAvailable: 6,
        totalSpots: 8
      }
    ],
    reviews: [
      {
        id: 'review-bush-1',
        author: 'David Wilson',
        rating: 5,
        comment: 'The ultimate bush experience! Authentic, immersive, and absolutely breathtaking.',
        date: '2024-03-20',
        verified: true
      }
    ],
    rating: 4.9,
    reviewCount: 94,
    featured: true,
    maxGroupSize: 8,
    minAge: 12,
    physicalRating: 2,
    tags: ['Classic Safari', 'Bush Experience', 'Wildlife', 'Cultural']
  },
  {
    id: 'coastal-getaway-kenya',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'Coastal Getaway',
    slug: 'coastal-getaway-kenya',
    summary: 'Relax on pristine beaches, explore marine life, and discover coastal cultures on this rejuvenating East African coastal escape.',
    description: 'This coastal getaway combines relaxation on beautiful beaches with marine adventures and cultural experiences along Kenya\'s stunning coastline.',
    category: 'beach',
    duration: 6,
    difficultyLevel: 'Comfort',
    price: {
      amount: 1850,
      currency: 'USD',
      includes: [
        'Beach resort accommodation',
        'All meals and selected beverages',
        'Marine activities and excursions',
        'Cultural village visits',
        'Airport transfers'
      ],
      excludes: [
        'International flights',
        'Alcoholic beverages',
        'Travel insurance',
        'Personal expenses'
      ]
    },
    images: [
      {
        id: 'coastal-1',
        url: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg',
        alt: 'Tropical beach scene'
      }
    ],
    heroImage: {
      id: 'coastal-hero',
      url: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg',
      alt: 'Beautiful coastal scenery in Kenya'
    },
    country: 'kenya',
    city: 'Mombasa',
    itinerary: [
      {
        day: 1,
        title: 'Coastal Arrival',
        description: 'Arrive at the coast and settle into your beach resort.',
        activities: ['Airport transfer', 'Resort check-in', 'Beach orientation'],
        accommodation: 'Beach Resort',
        meals: ['Dinner']
      }
    ],
    includes: [
      'Beach resort accommodation',
      'All meals',
      'Marine activities (snorkeling, dhow trips)',
      'Cultural village visits',
      'Airport transfers'
    ],
    excludes: [
      'International flights',
      'Alcoholic beverages',
      'Travel insurance',
      'Personal expenses'
    ],
    whatToBring: [
      'Swimwear and beachwear',
      'Sunscreen and hat',
      'Comfortable sandals',
      'Camera for marine life',
      'Light cotton clothing'
    ],
    availability: [
      {
        startDate: '2024-07-01',
        endDate: '2024-07-06',
        spotsAvailable: 8,
        totalSpots: 12
      }
    ],
    reviews: [
      {
        id: 'review-coastal-1',
        author: 'Maria Santos',
        rating: 5,
        comment: 'Perfect beach getaway! The marine life and cultural experiences were incredible.',
        date: '2024-03-10',
        verified: true
      }
    ],
    rating: 4.7,
    reviewCount: 76,
    featured: true,
    maxGroupSize: 12,
    minAge: 8,
    physicalRating: 1,
    tags: ['Beach', 'Marine Life', 'Coastal Culture', 'Relaxation']
  },
  {
    id: 'safari-immersion-tanzania',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'Safari Immersion',
    slug: 'safari-immersion-tanzania',
    summary: 'Immerse yourself completely in the safari experience with extended wildlife viewing, photography workshops, and deep cultural connections.',
    description: 'This immersive safari experience goes beyond traditional game drives, offering photography workshops, extended wildlife observation, and meaningful cultural interactions.',
    category: 'wildlife',
    duration: 10,
    difficultyLevel: 'Platinum Experience',
    price: {
      amount: 4200,
      currency: 'USD',
      includes: [
        'Luxury safari accommodation',
        'All meals and beverages',
        'Professional photography guide',
        'Extended game drives',
        'Photography workshops',
        'Cultural interactions',
        'All park fees'
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
        id: 'safari-immersion-1',
        url: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg',
        alt: 'Wildlife photography scene'
      }
    ],
    heroImage: {
      id: 'safari-immersion-hero',
      url: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg',
      alt: 'Immersive safari experience'
    },
    country: 'tanzania',
    city: 'Arusha',
    itinerary: [
      {
        day: 1,
        title: 'Safari Immersion Begins',
        description: 'Arrive and begin your immersive safari journey with orientation and first game drive.',
        activities: ['Airport pickup', 'Safari briefing', 'Afternoon game drive'],
        accommodation: 'Safari Lodge',
        meals: ['Dinner']
      }
    ],
    includes: [
      'Luxury safari accommodation',
      'All meals and beverages',
      'Professional photography guide',
      'Extended game drives',
      'Photography workshops',
      'Cultural village visits',
      'All park fees and conservation contributions'
    ],
    excludes: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Personal expenses',
      'Camera equipment rental'
    ],
    whatToBring: [
      'DSLR or mirrorless camera',
      'Multiple lenses (wide-angle, telephoto)',
      'Extra camera batteries and memory cards',
      'Comfortable safari clothing',
      'Sun protection',
      'Notebook for photography tips'
    ],
    availability: [
      {
        startDate: '2024-08-15',
        endDate: '2024-08-24',
        spotsAvailable: 4,
        totalSpots: 6
      }
    ],
    reviews: [
      {
        id: 'review-immersion-1',
        author: 'James Mitchell',
        rating: 5,
        comment: 'The most immersive safari experience ever! Learned so much about photography and wildlife.',
        date: '2024-03-05',
        verified: true
      }
    ],
    rating: 4.8,
    reviewCount: 58,
    featured: true,
    maxGroupSize: 6,
    minAge: 14,
    physicalRating: 3,
    tags: ['Photography Safari', 'Immersive Experience', 'Wildlife', 'Cultural']
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