import { useRef, useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { ArrowLeft, ImagePlus, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/context/AuthContext';

interface ListingPayload {
  skill_offered: string | number;
  skill_desired: string | number;
  custom_offer_skill?: string;
  custom_desired_skill?: string;
  title: string;
  description: string;
  status: string;
  location_preference: string;
  portfolio_images?: string[];
}

interface Skill {
  skill_id: number;
  skill_name: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateListing = () => {
  const { showToast } = useToast();
  const { token } = useAuth();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [offerSkill, setOfferSkill] = useState<string | number>('');
  const [desiredSkill, setDesiredSkill] = useState<string | number>('');

  const [customOfferSkill, setCustomOfferSkill] = useState('');
  const [customDesiredSkill, setCustomDesiredSkill] = useState('');

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [locationPreference, setLocationPreference] = useState('Remote');

  const [portfolio, setPortfolio] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch skills from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/skills/`)
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error('Failed to fetch skills:', err));
  }, []);

  const onSelectFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    // Convert to array
    const arr = Array.from(selectedFiles);

    // Calculate how many more files can be added
    const availableSlots = 6 - files.length;
    if (availableSlots <= 0) return;

    // Take only files that fit in remaining slots
    const filesToAdd = arr.slice(0, availableSlots);

    setFiles((prev) => [...prev, ...filesToAdd]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectFiles(e.dataTransfer.files);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!offerSkill || !desiredSkill || !description) {
      showToast('Please fill in all required fields.', 'info');
      return;
    }

    setLoading(true);

    try {
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('title', title || description.slice(0, 50));
      formData.append('description', description);
      formData.append('status', 'active');
      formData.append('location_preference', locationPreference);

      // Skills
      if (offerSkill === 'other') {
        formData.append('skill_offered', 'other');
        formData.append('custom_offer_skill', customOfferSkill.trim());
      } else {
        formData.append('skill_offered', String(offerSkill));
      }

      if (desiredSkill === 'other') {
        formData.append('skill_desired', 'other');
        formData.append('custom_desired_skill', customDesiredSkill.trim());
      } else {
        formData.append('skill_desired', String(desiredSkill));
      }

      // Portfolio images (limit 5)
      files.slice(0, 5).forEach((file) => {
        formData.append('portfolio_images', file);
      });

      const res = await fetch(`${API_BASE_URL}/listings/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        showToast('Failed to create listing: ' + JSON.stringify(err), 'error');
        setLoading(false);
        return;
      }

      const data = await res.json();
      showToast('Listing created successfully!', 'success');
      console.log('Created listing:', data);

      // Reset form
      setOfferSkill('');
      setDesiredSkill('');
      setCustomOfferSkill('');
      setCustomDesiredSkill('');
      setTitle('');
      setDescription('');
      setPortfolio('');
      setFiles([]);
    } catch (err) {
      console.error(err);
      showToast('Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-800">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white dark:bg-gray-800">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
          <button
            aria-label="Back"
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-100">
            New Skill Trade
          </h1>
        </div>
      </header>

      <form
        onSubmit={onSubmit}
        className="mx-auto w-full flex-1 overflow-auto px-4 py-6 pb-32 md:pb-40"
      >
        {/* Skill you want to offer */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Skill you want to offer
          </label>
          <select
            value={offerSkill}
            onChange={(e) => setOfferSkill(e.target.value)}
            className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select skill</option>
            {skills.map((skill) => (
              <option key={skill.skill_id} value={skill.skill_id}>
                {skill.skill_name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>

          {offerSkill === 'other' && (
            <input
              type="text"
              placeholder="Enter your custom skill"
              value={customOfferSkill}
              onChange={(e) => setCustomOfferSkill(e.target.value)}
              className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-black dark:bg-gray-800 dark:text-white"
            />
          )}
        </div>

        {/* Skill you're looking for */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Skill you're looking for
          </label>
          <select
            value={desiredSkill}
            onChange={(e) => setDesiredSkill(e.target.value)}
            className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select skill</option>
            {skills.map((skill) => (
              <option key={skill.skill_id} value={skill.skill_id}>
                {skill.skill_name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>

          {desiredSkill === 'other' && (
            <input
              type="text"
              placeholder="Enter your custom desired skill"
              value={customDesiredSkill}
              onChange={(e) => setCustomDesiredSkill(e.target.value)}
              className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-black dark:bg-gray-800 dark:text-white"
            />
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Teach Python in Exchange for UI Design"
            className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-black dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Describe your trade
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Tell us more about the skills you're offering and what you're looking for in return."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 placeholder:text-gray-400 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-50"
          />
        </div>

        {/* Location Preference */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Location Preference
          </label>
          <select
            value={locationPreference}
            onChange={(e) => setLocationPreference(e.target.value)}
            className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Showcase upload */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Showcase your work
          </label>
          <div
            onDrop={(e) => {
              if (files.length >= 6) return; // prevent drop if 6 files already
              handleDrop(e);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
              if (files.length >= 6) return; // prevent opening file picker
              openFilePicker();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (files.length >= 6) return;
              if (e.key === 'Enter' || e.key === ' ') openFilePicker();
            }}
            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-4 py-8 hover:bg-gray-50 dark:hover:bg-gray-700 ${files.length >= 6 ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-100">
              <ImagePlus size={20} />
              <span className="font-medium">
                {' '}
                {files.length >= 6
                  ? 'Maximum 6 files reached'
                  : 'Add Examples or Portfolio'}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-50">
              Click to upload or drag & drop (images, pdf, up to 6 files)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => onSelectFiles(e.target.files)}
              className="hidden"
              accept="image/*,.pdf"
              multiple
              disabled={files.length >= 6}
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {files.map((f, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-md border border-gray-200 bg-white dark:bg-gray-800"
                >
                  {f.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="h-28 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-28 items-center justify-center">
                      <div className="px-2 text-sm text-gray-600 dark:text-gray-100">
                        {f.name}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute -top-2 -right-2 rounded-full bg-white p-1 shadow dark:bg-gray-800"
                    aria-label={`Remove ${f.name}`}
                  >
                    <svg
                      className="h-4 w-4 text-gray-600 dark:text-gray-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 6L18 18M6 18L18 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio link */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-100">
            Or add a link to your portfolio
          </label>
          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:bg-gray-600">
            <div className="mr-3 text-gray-500">
              <LinkIcon size={18} />
            </div>
            <input
              type="url"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-50"
            />
          </div>
        </div>
      </form>

      {/* Sticky bottom CTA */}
      <div className="safe-bottom fixed right-0 bottom-12 left-0 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-600 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          <Button
            onClick={() => onSubmit()}
            className="w-full rounded-full bg-[#FF2E2E] py-4 text-lg font-semibold shadow-lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
