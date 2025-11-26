import { useState, useEffect, type ChangeEvent } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import axios from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [avatar, setAvatar] = useState<string | null>(user?.profile_picture_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [name, setName] = useState(user?.username || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [role, setRole] = useState(user?.role || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [email, setEmail] = useState(user?.email || "");
  const [location, setLocation] = useState(user?.location || "");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ your backend returns { user: {...} }
        const data = res.data.user || res.data;

        setName(data.username || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setRole(data.role || "");
        setBio(data.bio || "");
        setEmail(data.email || "");
        setLocation(data.location || "");
        setAvatar(data.profile_picture_url || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        showToast("Failed to load profile ❌", "error");
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
      formData.append("username", name);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("role", role);
      formData.append("bio", bio);
      formData.append("location", location);
      if (avatarFile) formData.append("profile_picture_url", avatarFile);

      await axios.patch("/auth/me/update/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Profile updated successfully ✅", "success");
      navigate("/app/dashboard");
    } catch (error: any) {
      console.error("Profile update error:", error.response || error);
      showToast("Failed to update profile ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-5 md:px-8 max-w-xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          Edit Profile
        </h1>
        <div className="w-6" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-20">
        <div className="max-w-xl mx-auto w-full flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-8">
            <img
              src={avatar || "https://img.icons8.com/office/40/person-male.png"}
              alt="Profile"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border border-gray-200"
            />
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full cursor-pointer shadow-md transition"
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
          <form className="space-y-5 w-full">
            <div>
              <label className="block text-gray-800 font-medium mb-1">Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer, UI/UX Designer"
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </form>
        </div>
      </main>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handleSave}
            disabled={loading}
            fullWidth
            className="bg-red-600 hover:bg-red-700 text-white py-3 text-lg rounded-xl"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
