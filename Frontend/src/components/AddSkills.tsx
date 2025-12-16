import { useState } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

const AddSkills = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [skills, setSkills] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [lookingInput, setLookingInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const addLooking = () => {
    if (lookingInput.trim() && !lookingFor.includes(lookingInput.trim())) {
      setLookingFor([...lookingFor, lookingInput.trim()]);
      setLookingInput('');
    }
  };

  const removeSkill = (s: string) =>
    setSkills(skills.filter((skill) => skill !== s));

  const removeLooking = (s: string) =>
    setLookingFor(lookingFor.filter((skill) => skill !== s));

  const saveSkills = async () => {
    if (!skills.length && !lookingFor.length) {
      showToast('Add at least one skill', 'info');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        offerings: skills.map((s) => ({
          skill_name: s,
          proficiency_level: 'Beginner',
        })),
        desires: lookingFor.map((s) => ({
          skill_name: s,
        })),
      };

      const res = await axios.post('/user-skills/add-skills/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Saved skills response:', res.data);
      showToast('Skills saved successfully', 'success');
      navigate(-1);
    } catch (err) {
      console.error(err);
      showToast('Failed to save skills', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-6 dark:bg-gray-900">
      <ChevronLeft
        size={28}
        className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
        onClick={() => navigate(-1)}
      />
      <h1 className="mb-20 text-lg font-bold text-gray-900 dark:text-gray-100">
        Add Skills
      </h1>

      {/* Offered skills */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300">
          Skills you offer
        </label>

        <div className="flex items-center rounded-lg border px-3 py-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. Web Design"
            className="flex-1 bg-transparent outline-none"
          />
          <button onClick={addSkill}>
            <Plus size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-600"
            >
              {s}
              <X size={14} onClick={() => removeSkill(s)} />
            </span>
          ))}
        </div>
      </div>

      {/* Desired skills */}
      <div className="mt-8 space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300">
          Skills you want
        </label>

        <div className="flex items-center rounded-lg border px-3 py-2">
          <input
            value={lookingInput}
            onChange={(e) => setLookingInput(e.target.value)}
            placeholder="e.g. SEO"
            className="flex-1 bg-transparent outline-none"
          />
          <button onClick={addLooking}>
            <Plus size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {lookingFor.map((s) => (
            <span
              key={s}
              className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-600"
            >
              {s}
              <X size={14} onClick={() => removeLooking(s)} />
            </span>
          ))}
        </div>
      </div>

      <Button
        onClick={saveSkills}
        disabled={saving}
        className="mt-10 w-full bg-red-500"
      >
        {saving ? 'Saving…' : 'Save skills'}
      </Button>
    </div>
  );
};

export default AddSkills;
