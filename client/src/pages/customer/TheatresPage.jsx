import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Search, Sparkles, Film, ArrowRight, Check } from 'lucide-react';
import API from '../../services/api';
import { useCity } from '../../context/CityContext';
import EmptyState from '../../components/common/EmptyState';

const TheatresPage = () => {
  const { selectedCity, changeCity, availableCities } = useCity();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheatres = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCity && selectedCity !== 'All Cities') {
          params.append('city', selectedCity);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const res = await API.get(`/theatres?${params.toString()}`);
        setTheatres(res.data.theatres || []);
      } catch (err) {
        console.error('Error fetching theatres', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, [selectedCity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27324A] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Cinemas & Multiplexes</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Discover premier cinema venues and immersive auditoriums in {selectedCity}
          </p>
        </div>

        {/* City Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search theatres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11182B] text-sm text-[#F8FAFC] placeholder-[#94A3B8] pl-9 pr-4 py-2 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => changeCity(e.target.value)}
            className="w-full sm:w-auto bg-[#11182B] text-sm font-semibold text-[#A855F7] px-4 py-2 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
          >
            {availableCities.map((c) => (
              <option key={c} value={c} className="bg-[#171D33] text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Theatres List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-[#171D33] rounded-2xl animate-pulse border border-[#27324A]"></div>
          ))}
        </div>
      ) : theatres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED] transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">{theatre.name}</h3>
                    <p className="text-xs text-[#94A3B8] flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>{theatre.address}, {theatre.city} - {theatre.pincode}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                    Open
                  </span>
                </div>

                {/* Facilities */}
                <div className="mt-4 pt-3 border-t border-[#27324A]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-2">
                    Available Experience & Formats
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {theatre.facilities?.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#11182B] text-[#F8FAFC] border border-[#27324A] flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3 text-[#A855F7]" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/movies`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-1.5 shadow-md shadow-[#7C3AED]/20"
                >
                  <span>View Movies Playing Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title={`No theatres found in ${selectedCity}`}
          description="Try switching cities or search for a different cinema branch."
          actionText="Switch to Mumbai"
          onAction={() => changeCity('Mumbai')}
        />
      )}

    </div>
  );
};

export default TheatresPage;

