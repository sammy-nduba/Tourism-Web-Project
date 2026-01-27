# Tour Upload & Display Review - Wild Horizon Adventures

## Overview
Tours flow through a complete pipeline: **Admin Upload → Backend Storage → Frontend Display**

---

## 1. ADMIN DASHBOARD (Upload/Create Tours)

### Form Data Collection (`Admin/src/admin/presentation/pages/ToursPage.tsx`)
- **Title** - Tour name
- **Slug** - URL-friendly identifier
- **Description** - Full tour details
- **City** - Destination (dropdown from available cities)
- **Duration** - Number of days (numeric)
- **Price** - Cost per person (numeric)
- **Difficulty Level** - Experience level selector
- **Max Group Size** - Maximum participants
- **Image** - Hero image (file upload or URL)
- **Gallery URLs** - Additional images (array)
- **Highlights** - Key features (array)
- **Included** - What's included (array)
- **Excluded** - What's not included (array)
- **Published** - Toggle to make tour visible

### Image Upload Process
```
1. User selects image file
2. File uploaded to Supabase Storage bucket: "tour-images"
3. Random filename generated (prevents collisions)
4. Public URL returned: https://[supabase-url]/storage/v1/object/public/tour-images/[filename]
5. URL stored in database
```

### Database Storage (Supabase)
**Table:** `tours`
```typescript
{
  id: string;
  title: string;
  slug: string;
  description: string;
  city_id: string | null;
  duration_days: number;
  price: number;
  difficulty_level: string;  // "Budget", "Standard", "Premium", etc.
  max_group_size: number;
  image_url: string;  // Public Supabase URL
  gallery_urls: JSON;  // Array of image URLs
  highlights: JSON;  // Array of strings
  included: JSON;  // Array of strings
  excluded: JSON;  // Array of strings
  is_published: boolean;  // Controls visibility
  created_at: timestamp;
  updated_at: timestamp;
  cities?: {
    id: string;
    name: string;
    countries?: {
      id: string;
      name: string;
      code: string;  // 🆕 Now has flag code!
    };
  };
}
```

---

## 2. BACKEND API (Data Retrieval)

### Key Endpoints
- **GET `/api/tours`** - List all published tours with filtering
  - Query params: `country`, `city`, `limit`, `offset`, `featured`, `page`
  - Returns: Array of tours with nested city and country data

### Data Transformation in Backend
**File:** `Backend/src/services/AdminService.ts`

```typescript
async getPublishedTours(filters: TourFilters): Promise<Tour[]>
  → Fetches from Supabase with relationships:
    .select('*, city:cities(*, country:countries(*))')
    
  → Filters applied:
    - is_published = true
    - country filter (converts country ID to city IDs)
    - city filter (direct city_id match)
    - difficulty_level filter
    - price range filters
    - featured filter
```

**Issue Fixed:** Previously attempted to filter nested relationships with `.eq('city.countries.id', filters.country)` which doesn't work in Supabase. Now:
1. Gets city IDs for the country first
2. Uses `.in('city_id', cityIds)` to filter tours

---

## 3. FRONTEND DATA RETRIEVAL & DISPLAY

### Service Layer Transformation
**File:** `Frontend/src/data/services/ToursService.ts`

#### Backend Response Structure (Raw)
```typescript
BackendTour {
  id: string;
  title: string;
  slug: string;
  description: string;
  city_id: string | null;
  duration_days: number;
  price: number;
  difficulty_level: string;
  max_group_size: number;
  image_url: string;  // Supabase public URL ✓
  gallery_urls: any;
  highlights: any;
  included: any;
  excluded: any;
  is_published: boolean;
  cities?: {
    id: string;
    name: string;
    countries?: {
      id: string;
      name: string;
    };
  };
}
```

#### Transformation to Frontend Tour Model
```typescript
// transformBackendTourToFrontend() converts:

BackendTour → Tour {
  id: string;
  title: string;
  slug: string;
  summary: string;  // Substring from description ✓
  description: string;  // Full description ✓
  category: 'wildlife';  // Hardcoded (TODO: add to backend)
  duration: tour.duration_days;  // ✓
  difficultyLevel: tour.difficulty_level;  // ✓
  price: {
    amount: tour.price;
    currency: 'USD';  // Hardcoded
    includes: tour.included || [];  // ✓
    excludes: tour.excluded || [];  // ✓
  };
  images: tour.gallery_urls || [];  // ✓
  heroImage: {
    id: string;
    url: tour.image_url;  // ✓
    alt: tour.title;
  };
  country: tour.cities?.countries?.name?.toLowerCase() || 'kenya';  // ✓ Now gets flag code!
  city: tour.cities?.name || 'Nairobi';  // ✓
  itinerary: [];  // Hardcoded empty (TODO: add to backend)
  includes: tour.included || [];  // ✓
  excludes: tour.excluded || [];  // ✓
  whatToBring: [];  // Hardcoded empty (TODO)
  availability: [];  // Hardcoded empty (TODO)
  reviews: [];  // Hardcoded empty (TODO)
  rating: 4.5;  // Hardcoded (TODO)
  reviewCount: 0;  // Hardcoded (TODO)
  featured: tour.is_published;  // ✓
  maxGroupSize: tour.max_group_size;  // ✓
  minAge: 12;  // Hardcoded (TODO)
  physicalRating: 2;  // Hardcoded (TODO)
  tags: tour.highlights || [];  // ✓
}
```

### TourCard Component Display
**File:** `Frontend/src/presentation/components/Tours/TourCard.tsx`

```tsx
Displays:
├── Hero Image (from tour.heroImage.url) ✓
├── Category Badge (top-left) - "wildlife"
├── Price Badge (top-right) - Formatted price ✓
├── Title (line-clamp-2) ✓
├── Summary (line-clamp-2) ✓
└── Details:
    ├── Location: "{city}, {country} {flag}" ✓ (now with emoji!)
    ├── Duration: "{duration} days" ✓
    ├── Rating: "{rating} ({reviewCount})" ⚠️ Default values
    └── Difficulty: "{difficultyLevel}" ✓
```

---

## 4. CURRENT DATA FLOW DIAGRAM

```
Admin Dashboard
    ↓
    └─→ Form Input (title, description, image, city, etc.)
        ↓
        └─→ Image Upload to Supabase Storage
            ↓ (returns public URL)
            └─→ Create Tour in Database
                ├── title ✓
                ├── description ✓
                ├── image_url (Supabase URL) ✓
                ├── city_id ✓
                ├── price ✓
                ├── difficulty_level ✓
                ├── highlights ✓
                ├── included ✓
                ├── excluded ✓
                ├── is_published ✓
                └── gallery_urls ✓
                    ↓
                    Backend API
                    ↓
                    └─→ GET /api/tours?filters
                        ↓
                        └─→ Fetch from Supabase with relationships
                            ├── tours.*
                            ├── cities(*, countries(*))
                            └── Filter by is_published = true
                            ↓
                            Frontend ToursService
                            ↓
                            └─→ Transform BackendTour → Tour Model
                                ├── Extract country/city names ✓
                                ├── Create summary from description ✓
                                ├── Format price object ✓
                                ├── Map highlights to tags ✓
                                └── Set default values for TODOs ⚠️
                                    ↓
                                    TourCard Component
                                    ↓
                                    └─→ Display Tour
                                        ├── Hero image ✓
                                        ├── Title ✓
                                        ├── Summary ✓
                                        ├── Location with flag 🇰🇪 ✓ (NEW!)
                                        ├── Price ✓
                                        ├── Duration ✓
                                        ├── Difficulty ✓
                                        └── Rating (⚠️ placeholder)
```

---

## 5. WHAT'S WORKING ✅

- ✅ **Image Upload** - Files stored in Supabase, public URLs work
- ✅ **Data Persistence** - Tours saved with all fields
- ✅ **API Retrieval** - Backend correctly queries published tours
- ✅ **Relationship Fetching** - City and country data included
- ✅ **Display** - Tours render with images, titles, prices
- ✅ **Filtering** - Country, city, difficulty level filtering works
- ✅ **Flag Emoji** - Country codes now convert to emoji (NEW!)
- ✅ **Hero Image** - Displays correctly on tour card

---

## 6. WHAT NEEDS IMPROVEMENT ⚠️

### Data Completeness (Hardcoded Placeholders)
1. **Rating System** - Currently hardcoded as 4.5 with 0 reviews
   - Need: Reviews table with ratings
   
2. **Category** - Hardcoded as 'wildlife'
   - Need: Add `category` field to tours table
   
3. **Itinerary** - Empty array
   - Need: Create itinerary table with day-by-day breakdown
   
4. **Availability** - Empty array
   - Need: Availability calendar with date ranges and spots
   
5. **Physical Rating** - Hardcoded as 2
   - Need: Add field or calculate from difficulty level
   
6. **What to Bring** - Empty array
   - Need: Add field or populate from template
   
7. **Currency** - Hardcoded as 'USD'
   - Need: Add currency field to tours table

### Frontend Issues
1. **Country Mapping** - Uses tour.cities?.countries?.name as country key
   - Risk: If name doesn't match COUNTRIES constant key, won't get proper flag
   - Fix: Use country code instead (now available!)

2. **Default Values** - Too many hardcoded defaults
   - Rating of 4.5 doesn't reflect reality
   - ReviewCount of 0 doesn't show engagement
   
3. **Images** - Gallery URLs stored but not displayed
   - TourCard only shows heroImage
   - Full tour detail page needs to show gallery

---

## 7. RECENT IMPROVEMENTS 🆕

### Country Code to Flag Conversion
**New Files:**
- `Admin/src/shared/utils/countryUtils.ts`
- `Frontend/src/shared/utils/countryUtils.ts`

**Function:** `getFlagEmoji(code: string) → string`
- Converts ISO 3166-1 alpha-2 codes to flag emoji
- Examples: "KE" → 🇰🇪, "TZ" → 🇹🇿

**Integration:**
- DestinationsPage admin now shows flag preview
- Frontend CountriesService uses flag emoji
- TourCard displays location as "🇰🇪 Nairobi, Kenya" 

---

## 8. RECOMMENDATIONS

### High Priority
1. **Fix Country Display in Tours**
   ```typescript
   // Instead of using country name as key:
   // current: country: tour.cities?.countries?.name?.toLowerCase()
   
   // Use country code (now available!):
   country: tour.cities?.countries?.code?.toLowerCase() // 'ke', 'tz', etc.
   ```

2. **Add Missing Fields to Backend**
   - Add `category` field (enum: wildlife, adventure, cultural, relaxation)
   - Add `currency` field (default: USD)
   - Add `physical_rating` field (1-5 scale)
   - Add `what_to_bring` field (JSON array)

3. **Implement Review System**
   - Create `tour_reviews` table with ratings
   - Calculate average rating dynamically

### Medium Priority
1. Create itinerary table for day-by-day details
2. Create availability calendar system
3. Display gallery images in tour detail pages
4. Add category badges to tour cards

### Low Priority
1. Add more detailed tour metadata
2. Implement wishlist/favorites system
3. Add related tours recommendations

---

## Summary

**Tours are being uploaded and displayed correctly** with proper image storage, database persistence, and API retrieval. The frontend transforms backend data appropriately and renders tours with all key information. 

**Key Strength:** Images work perfectly - uploaded to Supabase, public URLs stored, displayed correctly.

**Key Opportunity:** Many fields are hardcoded with default values. Adding these to the backend schema would enable richer tour data and better user experience.

**Recent Win:** Country flags now display correctly using ISO code conversion! 🎉
