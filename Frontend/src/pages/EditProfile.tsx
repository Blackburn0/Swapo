import { useState, useEffect, type ChangeEvent } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import axios from '@/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [avatar, setAvatar] = useState<string | null>(
    user?.profile_picture_url || null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [name, setName] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [role, setRole] = useState(user?.role || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ your backend returns { user: {...} }
        const data = res.data.user || res.data;

        setName(data.username || '');
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setRole(data.role || '');
        setBio(data.bio || '');
        setEmail(data.email || '');
        setLocation(data.location || '');
        setAvatar(data.profile_picture_url || null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Failed to load profile ❌', 'error');
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ Handle avatar preview and store file
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save profile changes
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('username', name);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('role', role);
      formData.append('bio', bio);
      formData.append('location', location);

      if (avatarFile) formData.append('profile_picture_url', avatarFile);

      await axios.patch('/auth/me/update/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('Profile updated successfully ✅', 'success');
      navigate('/app/dashboard/profile');
    } catch (error: any) {
      console.error('Profile update error:', error.response || error);
      showToast('Failed to update profile ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-5 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-2 transition hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
          Edit Profile
        </h1>
        <div className="w-6" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-20 md:px-8">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-8">
            <img
              src={avatar || 'https://img.icons8.com/office/40/person-male.png'}
              alt="Profile"
              className="h-32 w-32 rounded-full border border-gray-200 object-cover md:h-36 md:w-36"
            />
            <label
              htmlFor="avatarUpload"
              className="absolute right-2 bottom-2 cursor-pointer rounded-full bg-red-600 p-2 text-white shadow-md transition hover:bg-red-700"
            >
              <Pencil size={16} />
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Form */}
          <form className="w-full space-y-5">
            <div>
              <label className="mb-1 block font-medium text-gray-800">
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-800">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-800">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-800">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer, UI/UX Designer"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-800">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-800">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </main>

      {/* Save Button */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white px-4 py-3 shadow-sm md:px-8">
        <div className="mx-auto max-w-xl">
          <Button
            onClick={handleSave}
            disabled={loading}
            fullWidth
            className="rounded-xl bg-red-600 py-3 text-lg text-white hover:bg-red-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
