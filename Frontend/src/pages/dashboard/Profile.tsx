import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronLeft,
  Code,
  Film,
  Mic,
  PencilRuler,
  Settings,
  Star,
  StarHalf,
  ThumbsDown,
  ThumbsUp,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const nav = ['All', 'Offered Skills', 'Desired Skills', 'Portfolio'];

const skillsData = {
  'Offered Skills': [
    { icon: PencilRuler, title: 'UX Design' },
    { icon: Code, title: 'Web Development' },
    { icon: Video, title: 'Photography' },
  ],
  'Desired Skills': [
    { icon: Mic, title: 'Public Speaking' },
    { icon: Film, title: 'Video Editing' },
  ],
};

const portfolioData = [
  { url: '', image: '' },
  { url: '', image: '' },
  { url: '', image: '' },
];

const reviewers = [
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
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const { user, isAuthenticated } = useAuth();

  const rating = 4.5;
  const maxStars = 5;

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
            src="https://img.icons8.com/office/40/person-male.png"
            alt="Profile Photo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="my-5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isAuthenticated ? user?.username : 'John Doe'}
          </h1>
          <div className="font-medium text-gray-600 dark:text-gray-300">
            <p className="mt-[1px] mb-1 text-sm">UX Designer</p>
            <p className="text-xs">Joined 2021</p>
          </div>
        </div>
        <Button className="w-full">Edit Profile</Button>
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
            <div className="flex flex-wrap gap-3">
              {skillsData['Offered Skills'].map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-lg border border-gray-400 p-8 pt-5 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <skill.icon
                    size={20}
                    className="text-red-600 dark:text-red-500"
                  />
                  <div className="text-base font-bold text-gray-700 dark:text-gray-100">
                    {skill.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'All' || activeTab === 'Desired Skills') && (
          <div>
            <h2 className="mt-3 mb-6 text-left text-xl font-bold text-gray-900 dark:text-gray-100">
              Desired Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {skillsData['Desired Skills'].map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-lg border border-gray-400 p-8 pt-5 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <skill.icon
                    size={20}
                    className="text-red-600 dark:text-red-500"
                  />
                  <div className="text-base font-bold text-gray-700 dark:text-gray-100">
                    {skill.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'All' || activeTab === 'Portfolio') && (
          <div>
            <h2 className="mt-3 mb-6 text-left text-xl font-bold text-gray-900 dark:text-gray-100">
              Portfolio
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {portfolioData.map((item, idx) => (
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
              const percentMap: Record<number, number> = {
                5: 70,
                4: 20,
                3: 5,
                2: 3,
                1: 2,
              };
              const percent = percentMap[star];
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="w-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {star}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-red-100/50 dark:bg-red-900/50">
                    <div
                      className="h-2 bg-red-500 dark:bg-red-400"
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
                      size={14}
                      className={
                        starIdx < reviewer.stars
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }
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
