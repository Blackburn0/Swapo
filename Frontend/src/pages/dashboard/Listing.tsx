import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Tag, Briefcase } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface Listing {
  listing_id: number;
  user_id: number;
  skill_offered: number;
  skill_offered_name: string;
  skill_desired: number;
  skill_desired_name: string;
  title: string;
  description: string;
  status: string;
  creation_date: string;
  last_updated: string;
  location_preference: string;
}

const categories = ['All', 'Design', 'Development', 'Marketing'];

// Function to map skill name to a category
const getCategory = (skillName: string) => {
  if (!skillName) return 'Other';
  skillName = skillName.toLowerCase();
  if (skillName.includes('design')) return 'Design';
  if (skillName.includes('developer') || skillName.includes('engineer'))
    return 'Development';
  if (
    skillName.includes('marketing') ||
    skillName.includes('seo') ||
    skillName.includes('social')
  )
    return 'Marketing';
  return 'Other';
};

const ListingPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  // create a /api/v1/me/ endpoint in backend to get
  // {
  //   "id": 51,
  //   "username": "gift",
  //   "email": "gift@gmail.com"
  // }

  console.log('Current User', currentUser);
  console.log('lisitngs', listings);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/listings/`);
        if (!res.ok) throw new Error('Failed to fetch listings');
        const data: Listing[] = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Map API data to component format
  const mappedListings = listings.map((l) => ({
    listing_id: l.listing_id,
    user_id: l.user_id,
    id: l.listing_id,
    name: `User ${l.user_id}`,
    role: l.title || 'No Title',
    offering: l.skill_offered_name,
    seeking: l.skill_desired_name,
    image: 'https://img.icons8.com/office/40/person-female.png',
  }));

  // Filtered results
  const filteredListings = mappedListings.filter((l) => {
    const listingCategory = getCategory(l.offering);
    const matchesCategory =
      activeCategory === 'All' || listingCategory === activeCategory;
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.offering.toLowerCase().includes(search.toLowerCase()) ||
      l.seeking.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white px-4 pt-5 pb-20 md:px-8 dark:bg-black">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
          Browse Skills
        </h1>

        {/* Filter Icon */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="cursor-pointer rounded-full bg-gray-100 p-2.5 transition hover:bg-gray-200 dark:bg-black/10"
          aria-label="Open Filters"
        >
          <SlidersHorizontal
            size={22}
            className="text-gray-700 dark:text-white"
          />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 dark:text-white"
        />
        <input
          type="text"
          placeholder="Search skills, people or trades..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-11 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
        />
      </div>

      {/* Category Tabs */}
      <div className="no-scrollbar mb-6 flex space-x-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'cursor-pointer rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition',
              activeCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading listings...</p>
      ) : (
        <div className="grid gap-5">
          {filteredListings.map((listing) => {
            const isOwner = currentUser?.id === listing.user_id;

            return (
              <div
                key={listing.id}
                className="rounded-2xl border border-gray-100 p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="items-left flex gap-4">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {listing.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {listing.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-red-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Offering:
                      </span>{' '}
                      {listing.offering}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase
                      size={16}
                      className="text-gray-500 dark:text-white"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Seeking:
                      </span>{' '}
                      {listing.seeking}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <Button
                    className="w-full rounded-xl bg-red-600 py-2 text-sm text-white hover:bg-red-700"
                    onClick={() => {
                      isOwner
                        ? navigate(`/app/dashboard/profile`)
                        : navigate(
                            `/app/dashboard/profile/${listing.listing_id}`,
                          );
                    }}
                  >
                    {isOwner ? 'Your Profile' : 'View Profile'}
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredListings.length === 0 && (
            <p className="col-span-full mt-10 text-center text-gray-500">
              No results found.
            </p>
          )}
        </div>
      )}

      {/* Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 md:items-center">
          {/* Drawer Content */}
          <div className="w-full rounded-t-2xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur-md md:max-w-md md:rounded-2xl">
            {/* Drawer Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Example filter checkboxes */}
            <div className="mb-5 space-y-3">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" className="accent-red-600" /> Remote Only
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" className="accent-red-600" /> Verified
                Users
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" className="accent-red-600" /> With
                Portfolio
              </label>
            </div>

            <Button
              fullWidth
              onClick={() => setIsFilterOpen(false)}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
