import { useEffect, useState } from 'react';
import { adminService } from '../../services/AdminService';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, X, Upload, Calendar, Trash } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../lib/database.types';

type Tour = {
  id: string;
  title: string;
  slug: string;
  description: string;
  city_id: string | null;
  duration_days: number;
  price: number;
  difficulty_level: string;
  max_group_size: number;
  image_url: string;
  gallery_urls: any;
  highlights: any;
  included: any;
  excluded: any;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  cities?: {
    id: string;
    name: string;
    countries?: {
      id: string;
      name: string;
    };
  } | null;
};

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
}

interface AvailabilitySlot {
  startDate: string;
  endDate: string;
  spotsAvailable: number;
  totalSpots: number;
}

interface TourFormData {
  title: string;
  slug: string;
  description: string;
  country_name: string;
  city_name: string;
  duration_days: number;
  price: number;
  difficulty_level: string;
  max_group_size: number;
  image_url: string;
  image_file: File | null;
  gallery_urls: string[];
  gallery_files: File[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  what_to_bring: string[];
  tags: string[];
  min_age: number;
  physical_rating: number;
  featured: boolean;
  availability: AvailabilitySlot[];
  is_published: boolean;
}
type TourInsert = Database['public']['Tables']['tours']['Insert'];

export function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<TourFormData>({
    title: '',
    slug: '',
    description: '',
    country_name: '',
    city_name: '',
    duration_days: 1,
    price: 0,
    difficulty_level: 'Budget',
    max_group_size: 10,
    image_url: '',
    image_file: null,
    gallery_urls: [],
    gallery_files: [],
    highlights: [],
    included: [],
    excluded: [],
    itinerary: [],
    what_to_bring: [],
    tags: [],
    min_age: 12,
    physical_rating: 2,
    featured: false,
    availability: [],
    is_published: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTours();
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const data = await adminService.getCities();
      setCities(data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const loadTours = async () => {
    try {
      const data = await adminService.getTours();
      setTours(data);
    } catch (error) {
      console.error('Failed to load tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      await adminService.deleteTour(id);
      await loadTours();
    } catch (error) {
      console.error('Failed to delete tour:', error);
      alert('Failed to delete tour');
    }
  };

  const togglePublish = async (tour: Tour) => {
    try {
      await adminService.updateTour(tour.id, { is_published: !tour.is_published });
      await loadTours();
    } catch (error) {
      console.error('Failed to update tour:', error);
      alert('Failed to update tour');
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `tour-images/${fileName}`;

      // Upload directly - bucket must exist in Supabase
      // Note: listBuckets() requires admin privileges, so we skip the check
      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      const errorMsg = error?.message || 'Failed to upload image';
      alert(`Upload failed: ${errorMsg}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image_file: file }));
    }
  };

  const handleInputChange = (field: keyof TourFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.slug.trim()) {
      alert('Title and slug are required');
      return;
    }

    if (!formData.image_file && !formData.image_url) {
      alert('Please upload or provide an image');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = formData.image_url;

      // Upload image if a new file was selected
      if (formData.image_file) {
        imageUrl = await handleImageUpload(formData.image_file);
      }

      // Upload gallery images
      const uploadedGalleryUrls = [...formData.gallery_urls];
      for (const file of formData.gallery_files) {
        try {
          const url = await handleImageUpload(file);
          uploadedGalleryUrls.push(url);
        } catch (err) {
          console.error('Failed to upload gallery image:', err);
        }
      }

      // Look up city by name and country
      let city_id: string | null = null;
      if (formData.city_name.trim() && formData.country_name.trim()) {
        try {
          const matchedCity = cities.find(
            (c: any) => c.name.toLowerCase() === formData.city_name.toLowerCase() &&
              c.countries?.name?.toLowerCase() === formData.country_name.toLowerCase()
          );
          city_id = matchedCity?.id || null;
        } catch (error) {
          console.error('Error matching city:', error);
        }
      }

      const tourData: TourInsert = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        city_id,
        duration_days: formData.duration_days,
        price: formData.price,
        difficulty_level: formData.difficulty_level,
        max_group_size: formData.max_group_size,
        image_url: imageUrl,
        gallery_urls: uploadedGalleryUrls,
        highlights: formData.highlights,
        included: formData.included,
        excluded: formData.excluded,
        itinerary: formData.itinerary as any,
        what_to_bring: formData.what_to_bring,
        tags: formData.tags,
        min_age: formData.min_age,
        physical_rating: formData.physical_rating,
        featured: formData.featured,
        availability: formData.availability as any,
        is_published: formData.is_published,
      };

      await adminService.createTour(tourData);
      setShowAddModal(false);
      resetForm();
      await loadTours();
    } catch (error) {
      console.error('Failed to create tour:', error);
      alert('Failed to create tour');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      country_name: '',
      city_name: '',
      duration_days: 1,
      price: 0,
      difficulty_level: 'Budget',
      max_group_size: 10,
      image_url: '',
      image_file: null,
      gallery_urls: [],
      gallery_files: [],
      highlights: [],
      included: [],
      excluded: [],
      itinerary: [],
      what_to_bring: [],
      tags: [],
      min_age: 12,
      physical_rating: 2,
      featured: false,
      availability: [],
      is_published: false,
    });
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not a valid image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });
      setFormData(prev => ({
        ...prev,
        gallery_files: [...prev.gallery_files, ...newFiles]
      }));
    }
  };

  const removeGalleryFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_files: prev.gallery_files.filter((_, i) => i !== index)
    }));
  };

  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: nextDay,
          title: '',
          description: '',
          activities: [],
          accommodation: '',
          meals: []
        }
      ]
    }));
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    setFormData(prev => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  const handleArrayAdd = (field: keyof TourFormData, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
  };

  const handleArrayRemove = (field: keyof TourFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const addAvailabilitySlot = () => {
    setFormData(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          startDate: '',
          endDate: '',
          spotsAvailable: prev.max_group_size || 10,
          totalSpots: prev.max_group_size || 10
        }
      ]
    }));
  };

  const updateAvailabilitySlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    setFormData(prev => {
      const newAvailability = [...prev.availability];
      // If updating totalSpots, potentially update spotsAvailable too if it hasn't been manually tweaked
      if (field === 'totalSpots') {
        const spotNum = parseInt(value) || 0;
        newAvailability[index] = {
          ...newAvailability[index],
          totalSpots: spotNum,
          spotsAvailable: spotNum // For new entries, keep them in sync
        };
      } else {
        newAvailability[index] = { ...newAvailability[index], [field]: value };
      }
      return { ...prev, availability: newAvailability };
    });
  };

  const removeAvailabilitySlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tours Management</h1>
          <p className="text-slate-600 mt-1">Manage your adventure tours and experiences</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Tour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No tours found. Create your first tour to get started.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tour.image_url && (
                          <img
                            src={tour.image_url}
                            alt={tour.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{tour.title}</p>
                          <p className="text-sm text-slate-500">{tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {tour.cities ? `${tour.cities.name}, ${tour.cities.countries?.name}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {tour.duration_days} days
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${tour.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(tour)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${tour.is_published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                          }`}
                      >
                        {tour.is_published ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tour Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add New Tour</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tour title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="tour-slug"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tour description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country_name}
                    onChange={(e) => handleInputChange('country_name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Kenya, Tanzania, Uganda"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city_name}
                    onChange={(e) => handleInputChange('city_name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Nairobi, Dar es Salaam"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_days || 1}
                    onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Comfort">Comfort</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Platinum Experience">Platinum Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Group Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_group_size || 10}
                    onChange={(e) => handleInputChange('max_group_size', parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tour Image *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {formData.image_file ? (
                            <>
                              <p className="text-sm font-medium text-emerald-600">{formData.image_file.name}</p>
                              <p className="text-xs text-slate-500">Ready to upload</p>
                            </>
                          ) : formData.image_url ? (
                            <>
                              <img src={formData.image_url} alt="Preview" className="h-20 w-auto object-cover rounded mb-2" />
                              <p className="text-xs text-slate-500">Existing image</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              <p className="text-sm text-slate-600">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gallery Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.gallery_urls.map((url, index) => (
                      <div key={`url-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('gallery_urls', index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {formData.gallery_files.map((file, index) => (
                      <div key={`file-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                        <p className="text-[10px] text-slate-500 truncate px-2">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => removeGalleryFile(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-2 pb-3">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-600">Add Gallery Images</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Highlights */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Highlights</label>
                  <div className="space-y-2">
                    {formData.highlights.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 text-sm bg-slate-50 px-3 py-1 rounded border border-slate-200">{item}</span>
                        <button type="button" onClick={() => handleArrayRemove('highlights', index)} className="text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input type="text" id="new-highlight" placeholder="Add highlight..." className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleArrayAdd('highlights', (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />
                      <button type="button" onClick={() => { const input = document.getElementById('new-highlight') as HTMLInputElement; handleArrayAdd('highlights', input.value); input.value = ''; }} className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-xs font-medium">Add</button>
                    </div>
                  </div>
                </div>

                {/* Included */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Included</label>
                  <div className="space-y-2">
                    {formData.included.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 text-sm bg-slate-50 px-3 py-1 rounded border border-slate-200">{item}</span>
                        <button type="button" onClick={() => handleArrayRemove('included', index)} className="text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input type="text" id="new-included" placeholder="Add included..." className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleArrayAdd('included', (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />
                    </div>
                  </div>
                </div>

                {/* Excluded */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Excluded</label>
                  <div className="space-y-2">
                    {formData.excluded.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 text-sm bg-slate-50 px-3 py-1 rounded border border-slate-200">{item}</span>
                        <button type="button" onClick={() => handleArrayRemove('excluded', index)} className="text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input type="text" id="new-excluded" placeholder="Add excluded..." className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleArrayAdd('excluded', (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />
                    </div>
                  </div>
                </div>

                {/* What to Bring */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">What to Bring</label>
                  <div className="space-y-2">
                    {formData.what_to_bring.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 text-sm bg-slate-50 px-3 py-1 rounded border border-slate-200">{item}</span>
                        <button type="button" onClick={() => handleArrayRemove('what_to_bring', index)} className="text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input type="text" id="new-wtb" placeholder="Add item..." className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleArrayAdd('what_to_bring', (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                          {tag}
                          <button type="button" onClick={() => handleArrayRemove('tags', index)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <input type="text" id="new-tag" placeholder="Add tag..." className="w-full px-3 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleArrayAdd('tags', (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4 md:col-span-2 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Min Age</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_age}
                      onChange={(e) => handleInputChange('min_age', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Physical Rating (1-5)</label>
                    <select
                      value={formData.physical_rating}
                      onChange={(e) => handleInputChange('physical_rating', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} - {v === 1 ? 'Easy' : v === 3 ? 'Moderate' : v === 5 ? 'Extreme' : v}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center col-span-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-slate-700 font-medium">Featured Tour</label>
                  </div>
                </div>

                {/* Availability Section */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Availability & Booking Slots
                    </h3>
                    <button
                      type="button"
                      onClick={addAvailabilitySlot}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </button>
                  </div>

                  {formData.availability.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                      <p className="text-sm text-slate-500">No availability slots added. Users won't be able to book this tour.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.availability.map((slot, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end p-3 bg-slate-50 rounded-lg relative group">
                          <button
                            type="button"
                            onClick={() => removeAvailabilitySlot(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Start Date</label>
                            <input
                              type="date"
                              value={slot.startDate}
                              onChange={(e) => updateAvailabilitySlot(index, 'startDate', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">End Date</label>
                            <input
                              type="date"
                              value={slot.endDate}
                              onChange={(e) => updateAvailabilitySlot(index, 'endDate', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Total Spots</label>
                            <input
                              type="number"
                              min="1"
                              value={slot.totalSpots}
                              onChange={(e) => updateAvailabilitySlot(index, 'totalSpots', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Spots Available</label>
                            <input
                              type="number"
                              min="0"
                              value={slot.spotsAvailable}
                              onChange={(e) => updateAvailabilitySlot(index, 'spotsAvailable', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Itinerary Section */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Itinerary Builder
                    </h3>
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Day
                    </button>
                  </div>

                  {formData.itinerary.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                      <p className="text-sm text-slate-500">No itinerary days added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.itinerary.map((day, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Day {day.day}</span>
                            <button
                              type="button"
                              onClick={() => removeItineraryDay(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Day Title</label>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500"
                                placeholder="e.g., Arrival and Pick-up"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Description</label>
                              <textarea
                                value={day.description}
                                onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500"
                                placeholder="What happens on this day?"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Accommodation</label>
                              <input
                                type="text"
                                value={day.accommodation}
                                onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500"
                                placeholder="Hotel or Camp name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Meals</label>
                              <div className="flex flex-wrap gap-2">
                                {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                  <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={day.meals.includes(meal)}
                                      onChange={(e) => {
                                        const newMeals = e.target.checked
                                          ? [...day.meals, meal]
                                          : day.meals.filter(m => m !== meal);
                                        updateItineraryDay(index, 'meals', newMeals);
                                      }}
                                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-xs text-slate-600">{meal}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => handleInputChange('is_published', e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="is_published" className="ml-2 text-sm text-slate-700">
                    Publish immediately
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors"
                  >
                    {uploading ? 'Uploading image...' : saving ? 'Creating...' : 'Create Tour'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
