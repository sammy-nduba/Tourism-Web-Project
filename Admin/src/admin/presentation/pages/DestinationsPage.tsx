import { useEffect, useState } from 'react';
import { adminService } from '../../services/AdminService';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Database } from '../../../lib/database.types';
import { getCountryDisplay, getFlagEmoji } from '../../../shared/utils/countryUtils';

type Country = Database['public']['Tables']['countries']['Row'];
type City = Database['public']['Tables']['cities']['Row'];

interface CityWithCountry extends City {
  countries?: { id: string; name: string };
}

export function DestinationsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<CityWithCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [saving, setSaving] = useState(false);

  const [countryForm, setCountryForm] = useState({
    name: '',
    code: '',
    description: '',
    image_url: '',
  });

  const [cityForm, setCityForm] = useState({
    name: '',
    country_id: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [countriesData, citiesData] = await Promise.all([
        adminService.getCountries(),
        adminService.getCities(),
      ]);
      setCountries(countriesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to load destinations:', error);
      alert('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryForm.name.trim() || !countryForm.code.trim()) {
      alert('Country name and code are required');
      return;
    }

    setSaving(true);
    try {
      await adminService.createCountry({
        name: countryForm.name.trim(),
        code: countryForm.code.trim(),
        description: countryForm.description.trim(),
        image_url: countryForm.image_url.trim(),
      });
      setShowCountryModal(false);
      setCountryForm({ name: '', code: '', description: '', image_url: '' });
      await loadData();
    } catch (error) {
      console.error('Failed to create country:', error);
      alert('Failed to create country');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    if (!confirm('Are you sure? This will delete the country and all associated cities.')) return;

    try {
      await adminService.deleteCountry(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete country:', error);
      alert('Failed to delete country');
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.name.trim() || !cityForm.country_id) {
      alert('City name and country are required');
      return;
    }

    setSaving(true);
    try {
      await adminService.createCity({
        name: cityForm.name.trim(),
        country_id: cityForm.country_id,
        description: cityForm.description.trim(),
        image_url: cityForm.image_url.trim(),
      });
      setShowCityModal(false);
      setCityForm({ name: '', country_id: '', description: '', image_url: '' });
      await loadData();
    } catch (error) {
      console.error('Failed to create city:', error);
      alert('Failed to create city');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;

    try {
      await adminService.deleteCity(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete city:', error);
      alert('Failed to delete city');
    }
  };

  const citiesByCountry = (countryId: string) => {
    return cities.filter(c => c.country_id === countryId);
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
          <h1 className="text-2xl font-bold text-slate-900">Destinations</h1>
          <p className="text-slate-600 mt-1">Manage countries and cities</p>
        </div>
        <button
          onClick={() => setShowCountryModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Country
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {countries.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No countries found. Create your first country to get started.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {countries.map((country) => {
              const countryCities = citiesByCountry(country.id);
              const isExpanded = expandedCountry === country.id;

              return (
                <div key={country.id} className="bg-white hover:bg-slate-50 transition-colors">
                  {/* Country Header */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setExpandedCountry(isExpanded ? null : country.id)
                      }
                      className="flex items-center gap-4 flex-1 text-left hover:text-emerald-600"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          {getCountryDisplay(country.name, country.code)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {countryCities.length} cities
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      {country.image_url && (
                        <img
                          src={country.image_url}
                          alt={country.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCountry(country.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cities List */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Cities</h3>
                        <button
                          onClick={() => {
                            setSelectedCountry(country);
                            setCityForm({ ...cityForm, country_id: country.id });
                            setShowCityModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add City
                        </button>
                      </div>

                      {countryCities.length === 0 ? (
                        <p className="text-slate-500 text-sm py-4">No cities yet</p>
                      ) : (
                        <div className="space-y-2">
                          {countryCities.map((city) => (
                            <div
                              key={city.id}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {city.image_url && (
                                  <img
                                    src={city.image_url}
                                    alt={city.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-slate-900">{city.name}</p>
                                  {city.description && (
                                    <p className="text-xs text-slate-600 truncate">
                                      {city.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCity(city.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add New Country</h2>
              <button
                onClick={() => setShowCountryModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddCountry} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country Name *
                </label>
                <input
                  type="text"
                  value={countryForm.name}
                  onChange={(e) =>
                    setCountryForm({ ...countryForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Kenya"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country Code * <span className="text-xs text-slate-500 font-normal">(ISO 3166-1 alpha-2)</span>
                </label>
                <input
                  type="text"
                  value={countryForm.code}
                  onChange={(e) => {
                    const code = e.target.value.toUpperCase().slice(0, 2);
                    setCountryForm({ ...countryForm, code });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., KE (Kenya), US (USA), TZ (Tanzania)"
                  maxLength={2}
                  required
                />
                {countryForm.code && (
                  <p className="mt-2 text-sm text-slate-600">
                    Preview: {getFlagEmoji(countryForm.code)} {countryForm.name || 'Country'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={countryForm.description}
                  onChange={(e) =>
                    setCountryForm({ ...countryForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Country description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={countryForm.image_url}
                  onChange={(e) =>
                    setCountryForm({ ...countryForm, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCountryModal(false)}
                  className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors"
                >
                  {saving ? 'Creating...' : 'Create Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add City Modal */}
      {showCityModal && selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Add City to {selectedCountry.name}
              </h2>
              <button
                onClick={() => setShowCityModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddCity} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City Name *
                </label>
                <input
                  type="text"
                  value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Nairobi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={cityForm.description}
                  onChange={(e) =>
                    setCityForm({ ...cityForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="City description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={cityForm.image_url}
                  onChange={(e) =>
                    setCityForm({ ...cityForm, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors"
                >
                  {saving ? 'Creating...' : 'Create City'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
