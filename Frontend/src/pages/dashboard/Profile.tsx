import Button from '@/components/ui/Button';
import {
  ChevronLeft,
  Settings,
  Star,
  StarHalf,
  ThumbsDown,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/context/AuthContext';

const nav = ['All', 'Offered Skills', 'Desired Skills', 'Portfolio'];

interface UserSkill {
  user_skill_id: number;
  skill_name: string;
  proficiency_level?: string;
  details?: string;
}

const portfolioData = [
  { url: '', image: '' },
  { url: '', image: '' },
  { url: '', image: '' },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [reviewers, setReviewers] = useState([
    {
      img: 'https://img.icons8.com/office/40/person-male.png',
      name: 'Ethan Harper',
      date: '2 months ago',
      stars: 5,
      review:
        'Sophia is an exceptional designer. Her attention to detail and creative solutions truly elvated our project. Highly recommend!',
      likes: 12,
      dislikes: 1,
    },
    {
      img: 'https://img.icons8.com/office/40/person-female.png',
      name: 'Olivia Bennett',
      date: '1 months ago',
      stars: 4,
      review:
        'Sophia deliverd great work, but there were some communication challenges. Overall, satisfied with the final product.',
      likes: 8,
      dislikes: 2,
    },
  ]);

  const maxStars = 5;

  // Calculate overall rating from reviews
  const rating =
    reviewers.length > 0
      ? reviewers.reduce((sum, r) => sum + r.stars, 0) / reviewers.length
      : 0;

  // Calculate star distribution percentages
  const getStarDistribution = () => {
    const distribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    reviewers.forEach((r) => {
      if (distribution[r.stars] !== undefined) {
        distribution[r.stars]++;
      }
    });

    const total = reviewers.length || 1;
    return Object.fromEntries(
      Object.entries(distribution).map(([star, count]) => [
        star,
        Math.round((count / total) * 100),
      ]),
    );
  };

  const starDistribution = getStarDistribution();

  // Handle star click in individual reviews
  const handleStarClick = (reviewIndex: number, starRating: number) => {
    const updatedReviewers = [...reviewers];
    updatedReviewers[reviewIndex].stars = starRating;
    setReviewers(updatedReviewers);
  };

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [offeredSkills, setOfferedSkills] = useState<UserSkill[]>([]);
  const [desiredSkills, setDesiredSkills] = useState<UserSkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me');
        setProfile(res.data.user);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!user?.user_id) return;

      try {
        const res = await axios.get(`/user-skills/${user.user_id}/`);
        setOfferedSkills(res.data.offerings || []);
        setDesiredSkills(res.data.desires || []);
      } catch (err) {
        console.error('Failed to load user skills:', err);
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchUserSkills();
  }, [user]);

  if (loading || !profile) {
    return <p className="p-10 text-center">Loading profile...</p>;
  }

  console.log('PROFILE:', profile);

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-stone-50/50 py-2 pb-10 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Profile
          </h1>
        </div>
        <Settings
          size={20}
          className="absolute right-3 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate('/app/dashboard/settings')}
        />
      </div>

      {/* Profile Section */}
      <div className="rounded-b-lg bg-stone-50/50 px-4 pt-10 text-center dark:bg-gray-800">
        <div className="mx-auto h-36 w-36 overflow-hidden rounded-full bg-stone-200 dark:bg-gray-700">
          <img
            src={
              profile?.profile_picture_url ||
              'https://img.icons8.com/office/40/person-female.png'
            }
            alt="Profile Photo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="my-5">
          <h1 className="text-2xl font-bold text-gray-900 capitalize dark:text-gray-100">
            {profile?.first_name && profile?.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : profile?.username}
          </h1>
          <div className="font-medium text-gray-600 dark:text-gray-300">
            <p className="text-sm"> {profile.role || 'UX Designer'}</p>
            <p className="mt-[1px] mb-1 text-xs">
              {profile.bio || 'No bio yet'}
            </p>
          </div>
        </div>
        <Button className="w-full" onClick={() => navigate('/profile/edit')}>
          Edit Profile
        </Button>
      </div>

      {/* Navigation Tabs */}
      <nav className="mt-6 mb-6 border-b border-gray-200 px-4 dark:border-gray-600">
        <ul className="flex justify-start space-x-6 text-sm font-medium">
          {nav.map((link) => (
            <li
              key={link}
              className={`relative cursor-pointer pb-6 font-bold transition-colors ${
                activeTab === link
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab(link)}
            >
              {link}
              {activeTab === link && (
                <span className="absolute right-0 bottom-0 left-0 mx-auto mt-2 h-[3px] w-full rounded-full bg-red-500 dark:bg-red-400"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Tab Content */}
      <div className="flex flex-col space-y-4 px-6 pb-15">
        {/* Skills Cards */}
        {(activeTab === 'All' || activeTab === 'Offered Skills') && (
          <div>
            <h2 className="mt-3 mb-6 text-left text-xl font-bold text-gray-900 dark:text-gray-100">
              Offered Skills
            </h2>
            {skillsLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading skills...
              </p>
            ) : offeredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {offeredSkills.map((skill) => (
                  <div
                    key={skill.user_skill_id}
                    className="flex items-center gap-3 rounded-lg border border-gray-400 px-4 py-3 shadow-sm dark:border-gray-600 dark:bg-gray-800"
                  >
                    <Sparkles
                      size={18}
                      className="text-red-600 dark:text-red-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-100">
                        {skill.skill_name}
                      </span>
                      {skill.proficiency_level && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {skill.proficiency_level}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No skills offered yet
              </p>
            )}
          </div>
        )}

        {(activeTab === 'All' || activeTab === 'Desired Skills') && (
          <div>
            <h2 className="mt-3 mb-6 text-left text-xl font-bold text-gray-900 dark:text-gray-100">
              Desired Skills
            </h2>
            {skillsLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading skills...
              </p>
            ) : desiredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {desiredSkills.map((skill) => (
                  <div
                    key={skill.user_skill_id}
                    className="flex items-center gap-3 rounded-lg border border-gray-400 px-4 py-3 shadow-sm dark:border-gray-600 dark:bg-gray-800"
                  >
                    <Sparkles
                      size={18}
                      className="text-red-600 dark:text-red-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-100">
                        {skill.skill_name}
                      </span>
                      {skill.proficiency_level && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {skill.proficiency_level}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No skills desired yet
              </p>
            )}
          </div>
        )}

        {(activeTab === 'All' || activeTab === 'Portfolio') && (
          <div>
            <h2 className="mt-3 mb-6 text-left text-xl font-bold text-gray-900 dark:text-gray-100">
              Portfolio
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {portfolioData.map((_item, idx) => (
                <div
                  key={idx}
                  className="flex h-50 w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                >
                  Portfolio {idx + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="text-left">
          <h3 className="my-3 text-xl font-bold text-gray-900 dark:text-gray-100">
            Reviews
          </h3>
          <p className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {rating}
          </p>

          {/* Star Rating */}
          <div className="flex space-x-1">
            {Array.from({ length: maxStars }).map((_, i) => {
              if (i + 1 <= Math.floor(rating)) {
                return (
                  <Star
                    key={i}
                    size={14}
                    className="text-red-700 dark:text-red-400"
                    fill="currentColor"
                  />
                );
              } else if (i < rating) {
                return (
                  <StarHalf
                    key={i}
                    size={14}
                    className="text-red-700 dark:text-red-400"
                    fill="currentColor"
                  />
                );
              } else {
                return (
                  <Star
                    key={i}
                    size={14}
                    className="text-gray-300 dark:text-gray-600"
                    fill="currentColor"
                  />
                );
              }
            })}
          </div>
          <p className="my-2 text-sm text-gray-500 dark:text-gray-400">
            25 reviews
          </p>

          {/* Review Chart */}
          <div className="mt-6 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const percent = starDistribution[star] || 0;
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="w-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {star}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-red-100/50 dark:bg-red-900/50">
                    <div
                      className="h-2 bg-red-500 transition-all duration-300 dark:bg-red-400"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reviewers */}
          <div className="mt-6 space-y-4">
            {reviewers.map((reviewer, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
                    <img
                      src={reviewer.img}
                      alt={reviewer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {reviewer.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {reviewer.date}
                    </p>
                  </div>
                </div>
                <div className="mt-5 mb-3 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      size={16}
                      className={`cursor-pointer transition-colors ${
                        starIdx < reviewer.stars
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-gray-300 dark:text-gray-600'
                      } hover:text-red-500 dark:hover:text-red-300`}
                      fill={starIdx < reviewer.stars ? 'currentColor' : 'none'}
                      onClick={() => handleStarClick(idx, starIdx + 1)}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {reviewer.review}
                </p>
                <div className="mb-3 flex space-x-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} /> <span>{reviewer.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsDown size={16} /> <span>{reviewer.dislikes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
