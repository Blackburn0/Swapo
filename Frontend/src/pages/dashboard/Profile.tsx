import Button from '@/components/ui/Button';
import {
  ChevronLeft,
  Settings,
  Star,
  StarHalf,
  ThumbsDown,
  ThumbsUp,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/utils/axiosInstance';
import EmptySkillsState from '@/utils/EmptySkillsState';
import { useToast } from '@/hooks/useToast';

const nav = ['All', 'Offered Skills', 'Desired Skills', 'Portfolio'];

interface UserSkill {
  user_skill_id: number;
  user_id: number;
  skill: number;
  skill_name: string;
  skill_type: 'offering' | 'desiring';
  proficiency_level?: string;
  details?: string;
}

interface Reviewer {
  img: string;
  name: string;
  date: string;
  stars: number;
  review: string;
  likes: number;
  dislikes: number;
}

interface PortfolioImage {
  id: number;
  image_url: string;
  uploaded_at?: string;
  listing_id?: number | null;
  isUploading?: boolean;
}

interface PortfolioSectionProps {
  portfolioFiles: File[];
  setPortfolioFiles: React.Dispatch<React.SetStateAction<File[]>>;
  portfolioImages: PortfolioImage[];
  setPortfolioImages: React.Dispatch<React.SetStateAction<PortfolioImage[]>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSelectFiles: (files: FileList | null) => void;
  removeFile: (idx: number) => void;
}

interface Listing {
  id: number;
  portfolio_images: PortfolioImage[];
}

interface ProfileData {
  user_id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  bio?: string;
  profile_picture_url?: string;
  listings?: Listing[];
}

const StarRating = ({
  rating,
  maxStars = 5,
  onStarClick,
}: {
  rating: number;
  maxStars?: number;
  onStarClick?: (star: number) => void;
}) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= rating;
        const halfFilled = !filled && i < rating;
        return halfFilled ? (
          <StarHalf
            key={i}
            size={14}
            className="text-red-700 dark:text-red-400"
            fill="currentColor"
          />
        ) : (
          <Star
            key={i}
            size={14}
            className={`${
              filled
                ? 'text-red-700 dark:text-red-400'
                : 'text-gray-300 dark:text-gray-600'
            } ${onStarClick ? 'cursor-pointer hover:text-red-500 dark:hover:text-red-300' : ''}`}
            fill={filled ? 'currentColor' : 'none'}
            onClick={onStarClick ? () => onStarClick(starValue) : undefined}
          />
        );
      })}
    </div>
  );
};

const SkillsSection = ({
  title,
  skills,
  loading,
  onAdd,
}: {
  title: string;
  skills: UserSkill[];
  loading: boolean;
  onAdd: () => void;
}) => (
  <div>
    <div className="mt-3 mb-6 flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div title="Add more skills" className="cursor-pointer" onClick={onAdd}>
        <PlusCircle size={20} />
      </div>
    </div>
    {loading ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Loading skills...
      </p>
    ) : skills.length > 0 ? (
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.user_skill_id}
            className="flex items-center gap-3 rounded-lg border border-gray-400 px-4 py-3 shadow-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <Sparkles size={18} className="text-red-600 dark:text-red-500" />
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
      <EmptySkillsState
        title={`No ${title.toLowerCase()} yet`}
        description={`Add skills you ${title.includes('Offered') ? 'can offer' : 'want to learn'}.`}
        onAdd={onAdd}
      />
    )}
  </div>
);

const PortfolioSection = ({
  portfolioFiles,
  setPortfolioFiles,
  portfolioImages,
  setPortfolioImages,
  fileInputRef,
  onSelectFiles,
  removeFile,
}: PortfolioSectionProps) => {
  const [showDropzone, setShowDropzone] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  const fetchUserPortfolio = async () => {
    try {
      const res = await axios.get('/auth/me/portfolio-images/');
      setPortfolioImages(res.data.portfolio_images || []);
    } catch (err) {
      console.error('Failed to fetch user portfolio:', err);
    }
  };

  useEffect(() => {
    fetchUserPortfolio();
  }, []);

  /** Upload new files to user portfolio */
  const uploadFiles = async (files: File[], fileIndex?: number) => {
    if (!files.length) return;

    // Prevent duplicate uploads
    if (fileIndex !== undefined && uploadingFiles.has(fileIndex)) {
      return;
    }

    // Mark this file as uploading
    if (fileIndex !== undefined) {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.add(fileIndex);
        return newSet;
      });
    }

    // Create local preview placeholders
    const optimisticImages: PortfolioImage[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      image_url: URL.createObjectURL(file),
      isUploading: true,
    }));

    // Show instantly in UI
    setPortfolioImages((prev) => [...optimisticImages, ...prev]);

    const formData = new FormData();
    files.forEach((file) => formData.append('portfolio_images', file));

    try {
      await axios.post('/auth/me/portfolio-images/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Fetch real images from backend
      const res = await axios.get('/auth/me/portfolio-images/');
      setPortfolioImages(res.data.portfolio_images || []);

      setPortfolioFiles((prev) => prev.filter((f) => !files.includes(f)));

      showToast('Image(s) uploaded successfully!', 'success');
    } catch (err) {
      console.error('Upload failed:', err);

      // Remove optimistic images on failure
      setPortfolioImages((prev) => prev.filter((img) => !img.isUploading));

      showToast('Upload failed', 'error');
    } finally {
      // Remove from uploading set
      if (fileIndex !== undefined) {
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileIndex);
          return newSet;
        });
      }
    }
  };

  /** Delete a portfolio image */
  const deletePortfolioImage = async (imageId: number) => {
    try {
      await axios.delete(`/auth/me/portfolio-images/${imageId}/`);
      setPortfolioImages((prev) => prev.filter((img) => img.id !== imageId));
      showToast('Image deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete portfolio image:', err);
    }
  };

  /** Handle drag-and-drop */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onSelectFiles(e.dataTransfer.files);
  };

  return (
    <div className="mt-3 mb-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Portfolio
        </h2>
        {!showDropzone && (
          <button
            onClick={() => setShowDropzone(true)}
            className="flex cursor-pointer items-center justify-center text-black transition dark:text-white"
            title="Add more images"
          >
            <PlusCircle size={20} />
          </button>
        )}
      </div>

      {/* Dropzone */}
      {showDropzone && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-gray-50 p-6 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <PlusCircle size={20} className="mb-2 text-black dark:text-white" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Add portfolio images (max 6)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => onSelectFiles(e.target.files)}
          />
        </div>
      )}

      {/* Preview selected files */}
      {portfolioFiles.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {portfolioFiles.map((file, idx) => {
            const isUploading = uploadingFiles.has(idx);

            return (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={URL.createObjectURL(file)}
                  className={`h-full w-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                  alt="Portfolio preview"
                />

                {/* Uploading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-sm font-semibold text-white">
                      Uploading…
                    </span>
                  </div>
                )}

                {!isUploading && (
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 h-8 w-8 cursor-pointer rounded-full bg-white/20 p-1 font-bold shadow hover:text-black"
                  >
                    ✕
                  </button>
                )}

                <button
                  onClick={() => uploadFiles([file], idx)}
                  className={`absolute right-1 bottom-1 rounded-full px-3 py-1 text-xs font-semibold text-white shadow transition ${
                    isUploading
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'cursor-pointer bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Portfolio Images or Fallback */}
      {portfolioImages.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-gray-50 p-8 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <PlusCircle
            size={28}
            className="mb-2 text-gray-700 dark:text-gray-300"
          />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No portfolio images yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click to upload your first image
          </p>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => onSelectFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {portfolioImages.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <a href={img.image_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={img.image_url}
                  className={`h-full w-full object-cover transition-opacity ${
                    img.isUploading ? 'opacity-50' : 'opacity-100'
                  }`}
                  alt="Portfolio"
                />
              </a>

              {/* Uploading overlay */}
              {img.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-sm font-semibold text-white">
                    Uploading…
                  </span>
                </div>
              )}

              {/* Delete button only for real images */}
              {!img.isUploading && (
                <button
                  onClick={() => deletePortfolioImage(img.id)}
                  className="absolute top-1 right-1 h-8 w-8 cursor-pointer rounded-full bg-white/20 p-1 font-bold shadow hover:bg-red-600/70 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [offeredSkills, setOfferedSkills] = useState<UserSkill[]>([]);
  const [desiredSkills, setDesiredSkills] = useState<UserSkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const [reviewers, setReviewers] = useState<Reviewer[]>([
    {
      img: 'https://img.icons8.com/office/40/person-male.png',
      name: 'Ethan Harper',
      date: '2 months ago',
      stars: 5,
      review: 'Sophia is an exceptional designer. Highly recommend!',
      likes: 12,
      dislikes: 1,
    },
    {
      img: 'https://img.icons8.com/office/40/person-female.png',
      name: 'Olivia Bennett',
      date: '1 months ago',
      stars: 4,
      review: 'Sophia delivered great work.',
      likes: 8,
      dislikes: 2,
    },
  ]);

  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get('/auth/me/portfolio-images/');
        setPortfolioImages(res.data.portfolio_images || []);
      } catch (err) {
        console.error('Failed to fetch portfolio images', err);
      }
    };
    fetchPortfolio();
  }, []);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me');
        //  console.log('Profile', res.data.user);
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      if (!profile?.user_id) return setSkillsLoading(false);
      try {
        const res = await axios.get(`/user-skills/${profile.user_id}/`);
        setOfferedSkills(res.data.offerings || []);
        setDesiredSkills(res.data.desires || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSkillsLoading(false);
      }
    };
    fetchSkills();
  }, [profile?.user_id]);

  const onSelectFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const arr = Array.from(selectedFiles);
    const availableSlots = 6 - portfolioFiles.length;
    setPortfolioFiles((prev) => [...prev, ...arr.slice(0, availableSlots)]);
  };

  const removeFile = (idx: number) =>
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== idx));

  if (loading || !profile)
    return <p className="p-10 text-center">Loading profile...</p>;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-stone-50/50 py-2 pb-10 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Profile
        </h1>
        <Settings
          size={20}
          className="absolute right-3 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate('/app/dashboard/settings')}
        />
      </div>

      {/* Profile Info */}
      <div className="rounded-b-lg bg-stone-50/50 px-4 pt-10 text-center dark:bg-gray-800">
        <div className="mx-auto h-36 w-36 overflow-hidden rounded-full bg-stone-200 dark:bg-gray-700">
          <img
            src={
              profile.profile_picture_url ||
              'https://img.icons8.com/office/40/person-female.png'
            }
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="my-5">
          <h1 className="text-2xl font-bold text-gray-900 capitalize dark:text-gray-100">
            {profile.first_name && profile.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : profile.username}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {profile.role || 'UX Designer'}
          </p>
          <p className="mt-[1px] mb-1 text-xs">{profile.bio || 'No bio yet'}</p>
        </div>
        <Button className="w-full" onClick={() => navigate('/profile/edit')}>
          Edit Profile
        </Button>
      </div>

      {/* Tabs */}
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
                <span className="absolute right-0 bottom-0 left-0 mx-auto mt-2 h-[3px] w-full rounded-full bg-red-500 dark:bg-red-400" />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col space-y-4 px-6 pb-15">
        {(activeTab === 'All' || activeTab === 'Offered Skills') && (
          <SkillsSection
            title="Offered Skills"
            skills={offeredSkills}
            loading={skillsLoading}
            onAdd={() => navigate('/app/dashboard/profile/add-skills')}
          />
        )}

        {(activeTab === 'All' || activeTab === 'Desired Skills') && (
          <SkillsSection
            title="Desired Skills"
            skills={desiredSkills}
            loading={skillsLoading}
            onAdd={() => navigate('/app/dashboard/profile/add-skills')}
          />
        )}

        {(activeTab === 'All' || activeTab === 'Portfolio') && (
          <PortfolioSection
            portfolioFiles={portfolioFiles}
            setPortfolioFiles={setPortfolioFiles}
            portfolioImages={portfolioImages}
            setPortfolioImages={setPortfolioImages}
            fileInputRef={fileInputRef}
            onSelectFiles={onSelectFiles}
            removeFile={removeFile}
          />
        )}

        {/* Reviews */}
        <div className="text-left">
          <h3 className="my-3 text-xl font-bold text-gray-900 dark:text-gray-100">
            Reviews
          </h3>
          <p className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {(
              reviewers.reduce((sum, r) => sum + r.stars, 0) / reviewers.length
            ).toFixed(1)}
          </p>

          {/* Star Rating */}
          <StarRating
            rating={
              reviewers.reduce((sum, r) => sum + r.stars, 0) / reviewers.length
            }
          />

          {/* Review Chart */}
          {(() => {
            const distribution: Record<number, number> = {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            };
            reviewers.forEach((r) => {
              if (distribution[r.stars] !== undefined) distribution[r.stars]++;
            });
            const total = reviewers.length || 1;
            return (
              <div className="mt-6 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percent = Math.round(
                    (distribution[star] / total) * 100,
                  );
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
            );
          })()}

          {/* Individual Reviewers */}
          <div className="mt-6 space-y-4">
            {reviewers.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600">
                    <img
                      src={rev.img}
                      alt={rev.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {rev.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {rev.date}
                    </p>
                  </div>
                </div>
                <StarRating
                  rating={rev.stars}
                  onStarClick={(star) => {
                    const newRev = [...reviewers];
                    newRev[idx].stars = star;
                    setReviewers(newRev);
                  }}
                />
                <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rev.review}
                </p>
                <div className="mb-3 flex space-x-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} /> <span>{rev.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsDown size={16} /> <span>{rev.dislikes}</span>
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
