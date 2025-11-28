import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  PencilRuler,
  Code,
  Mic,
  Film,
  Video,
  Star,
  StarHalf,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import axiosInstance from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface ListingUser {
  id: number;
  username: string;
  role?: string;
  created_at: string;
  offered_skills?: string[] | string;
  desired_skills?: string[] | string;
  portfolio?: { url?: string; image?: string }[];
  rating?: number;
  reviews?: {
    name: string;
    img: string;
    date: string;
    stars: number;
    review: string;
    likes: number;
    dislikes: number;
  }[];
}

const OtherUserProfile = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<ListingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [showOptions, setShowOptions] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockRecordId, setBlockRecordId] = useState<number | null>(null);

  const { showToast } = useToast();
  // Fetch user data
  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/listings/${listingId}`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const data = await res.json();

        setUser({
          id: data.user_id,
          username: data.user?.username || `User ${data.user_id}`,
          role: data.skill_offered_name,
          created_at: data.creation_date,
          offered_skills: data.skill_offered_name,
          desired_skills: data.skill_desired_name,
          portfolio: data.portfolio || [],
          rating: data.rating || 0,
          reviews: data.reviews || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // Check if current user has blocked this user
  useEffect(() => {
    if (!user?.id) return;

    const checkBlocked = async () => {
      try {
        const res = await axiosInstance.get(
          `/userblocks/is-blocked/${user.id}/`,
        );
        setIsBlocked(res.data.is_blocked);
        setBlockRecordId(res.data.block_id || null); // store the correct block record ID
      } catch (err) {
        console.error(err);
      }
    };

    checkBlocked();
  }, [user?.id]);

  // Handle block/unblock
  const handleBlockUnblockUser = async () => {
    try {
      if (isBlocked) {
        // Get the existing block
        const res = await axiosInstance.get(`/userblocks/?blocked=${user?.id}`);
        const blockId = res.data[0]?.id;
        if (blockId) {
          await axiosInstance.delete(`/userblocks/${blockId}/`);
          showToast(`${user?.username} has been unblocked.`, 'success');
          setIsBlocked(false);
        }
      } else {
        // Block
        await axiosInstance.post('/userblocks/', { blocked: user?.id });
        showToast(`${user?.username} has been blocked.`, 'success');
        setIsBlocked(true);
      }
      setShowOptions(false);
    } catch (err) {
      console.error(err);
      showToast(
        isBlocked ? 'Failed to unblock user.' : 'Failed to block user.',
        'error',
      );
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (!user) return <p className="mt-10 text-center">User not found</p>;

  // Ensure arrays
  const offeredSkills = Array.isArray(user.offered_skills)
    ? user.offered_skills
    : user.offered_skills
      ? [user.offered_skills]
      : [];

  const desiredSkills = Array.isArray(user.desired_skills)
    ? user.desired_skills
    : user.desired_skills
      ? [user.desired_skills]
      : [];

  const portfolio = Array.isArray(user.portfolio) ? user.portfolio : [];
  const reviews = Array.isArray(user.reviews) ? user.reviews : [];
  const rating = user.rating || 0;
  const maxStars = 5;

  const nav = ['All', 'Offered Skills', 'Desired Skills', 'Portfolio'];

  return (
    <div className="mx-auto min-h-screen max-w-xl p-4">
      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between border-b pb-4">
        <div>
          <ChevronLeft
            size={28}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">{user.username}</h1>
        </div>

        <div className="relative">
          <MoreVertical
            className="cursor-pointer"
            onClick={() => setShowOptions((prev) => !prev)}
          />
          {showOptions && (
            <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border bg-white shadow-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <button
                className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600"
                onClick={handleBlockUnblockUser}
              >
                {isBlocked ? 'Unblock User' : 'Block User'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="text-center">
        <div className="mx-auto h-36 w-36 overflow-hidden rounded-full bg-gray-200">
          <img
            src="https://img.icons8.com/office/40/person-male.png"
            alt={user.username}
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="mt-4 text-xl font-bold">{user.username}</h2>
        <p className="text-gray-600">{user.role || 'Role not set'}</p>
        <p className="text-xs">
          Joined {new Date(user.created_at).getFullYear()}
        </p>
      </div>

      {/* Send Message Button */}
      <Button
        className="mt-6 w-full"
        onClick={() =>
          navigate('/app/dashboard/messages', {
            state: { userId: user.id, username: user.username },
          })
        }
        disabled={isBlocked}
      >
        {isBlocked ? 'Unblock user to send message' : 'Send Message'}
      </Button>

      {/* Tabs */}
      <nav className="mt-6 mb-4 border-b">
        <ul className="flex justify-start space-x-6 text-sm font-medium">
          {nav.map((link) => (
            <li
              key={link}
              className={`relative cursor-pointer pb-2 font-bold ${
                activeTab === link ? 'text-red-500' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(link)}
            >
              {link}
              {activeTab === link && (
                <span className="absolute right-0 bottom-0 left-0 mx-auto mt-2 h-[3px] w-full rounded-full bg-red-500"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col space-y-4">
        {/* Offered Skills */}
        {(activeTab === 'All' || activeTab === 'Offered Skills') && (
          <div>
            <h2 className="mt-3 mb-2 text-left text-xl font-bold">
              Offered Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {offeredSkills.map((title, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border p-4"
                >
                  <PencilRuler size={20} className="text-red-600" />
                  <span className="font-bold">{title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desired Skills */}
        {(activeTab === 'All' || activeTab === 'Desired Skills') && (
          <div>
            <h2 className="mt-3 mb-2 text-left text-xl font-bold">
              Desired Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {desiredSkills.map((title, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border p-4"
                >
                  <Mic size={20} className="text-red-600" />
                  <span className="font-bold">{title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {(activeTab === 'All' || activeTab === 'Portfolio') && (
          <div>
            <h2 className="mt-3 mb-2 text-left text-xl font-bold">Portfolio</h2>
            <div className="grid grid-cols-2 gap-3">
              {portfolio.length > 0 ? (
                portfolio.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex h-40 w-full items-center justify-center rounded-lg border bg-gray-100"
                  >
                    Portfolio {idx + 1}
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-gray-500">No portfolio items</p>
              )}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <h2 className="mt-3 mb-2 text-left text-xl font-bold">Reviews</h2>
          <p className="mb-2 text-2xl font-bold">{rating}</p>
          <div className="flex space-x-1">
            {Array.from({ length: maxStars }).map((_, i) => {
              if (i + 1 <= Math.floor(rating)) {
                return <Star key={i} size={14} className="text-red-700" />;
              } else if (i < rating) {
                return <StarHalf key={i} size={14} className="text-red-700" />;
              } else {
                return <Star key={i} size={14} className="text-gray-300" />;
              }
            })}
          </div>

          <div className="mt-4 mb-20 space-y-3">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center space-x-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                      <img
                        src={review.img}
                        alt={review.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="mt-2 mb-2 flex space-x-1">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        size={14}
                        className={
                          starIdx < review.stars
                            ? 'text-red-700'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <p className="mb-2 text-sm">{review.review}</p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp size={16} /> <span>{review.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown size={16} /> <span>{review.dislikes}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
