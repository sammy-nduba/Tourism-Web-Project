import { useEffect, useState } from 'react';
import { adminService } from '../../services/AdminService';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react';
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

interface TourFormData {
  title: string;
  slug: string;
  description: string;
  city_id: string;
  duration_days: number;
  price: number;
  difficulty_level: string;
  max_group_size: number;
  image_url: string;
  image_file: File | null;
  gallery_urls: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
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
    city_id: '',
    duration_days: 1,
    price: 0,
    difficulty_level: 'Budget',
    max_group_size: 10,
    image_url: '',
    image_file: null,
    gallery_urls: [],
    highlights: [],
    included: [],
    excluded: [],
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

      const tourData: TourInsert = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        city_id: formData.city_id || null,
        duration_days: formData.duration_days,
        price: formData.price,
        difficulty_level: formData.difficulty_level,
        max_group_size: formData.max_group_size,
        image_url: imageUrl,
        gallery_urls: formData.gallery_urls,
        highlights: formData.highlights,
        included: formData.included,
        excluded: formData.excluded,
        is_published: formData.is_published,
      };

      await adminService.createTour(tourData);
      setShowAddModal(false);
      setFormData({
        title: '',
        slug: '',
        description: '',
        city_id: '',
        duration_days: 1,
        price: 0,
        difficulty_level: 'Budget',
        max_group_size: 10,
        image_url: '',
        image_file: null,
        gallery_urls: [],
        highlights: [],
        included: [],
        excluded: [],
        is_published: false,
      });
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
      city_id: '',
      duration_days: 1,
      price: 0,
      difficulty_level: 'Budget',
      max_group_size: 10,
      image_url: '',
      image_file: null,
      gallery_urls: [],
      highlights: [],
      included: [],
      excluded: [],
      is_published: false,
    });
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                          tour.is_published
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
                    Destination (City) *
                  </label>
                  <select
                    value={formData.city_id}
                    onChange={(e) => handleInputChange('city_id', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select a destination...</option>
                    {cities.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
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
