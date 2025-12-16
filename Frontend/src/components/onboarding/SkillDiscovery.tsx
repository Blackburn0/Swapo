import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from './ProgressBar';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface SkillDiscoveryProps {
  onNext: () => void;
  onGoTo: (index: number) => void;
  step: number;
}

const SkillDiscovery = ({ onNext, onGoTo, step }: SkillDiscoveryProps) => {
  const [skills, setSkills] = useState<string[]>([
    'Photography',
    'Graphic Design',
    'Video Editing',
  ]);

  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [lookingInput, setLookingInput] = useState('');

  const { token } = useAuth();
  const { showToast } = useToast();

  const saveSkills = async () => {
    try {
      // Auto-add any pending input values before submitting
      const finalSkills = [...skills];
      const finalLookingFor = [...lookingFor];

      if (skillInput.trim() && !finalSkills.includes(skillInput.trim())) {
        finalSkills.push(skillInput.trim());
      }

      if (
        lookingInput.trim() &&
        !finalLookingFor.includes(lookingInput.trim())
      ) {
        finalLookingFor.push(lookingInput.trim());
      }

      const payload = {
        offerings: finalSkills.map((s) => ({
          skill_name: s,
          proficiency_level: 'Beginner',
        })),
        desires: finalLookingFor.map((s) => ({
          skill_name: s,
        })),
      };

      console.log('Submitting payload:', payload);

      await axios.post('/user-skills/add-skills/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast('Skills saved successfully!', 'success');
      onNext();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to save skills', 'error');
    }
  };

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

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleLookingKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLooking();
    }
  };

  const removeSkill = (s: string) =>
    setSkills(skills.filter((skill) => skill !== s));

  const removeLooking = (s: string) =>
    setLookingFor(lookingFor.filter((skill) => skill !== s));

  return (
    <section className="flex min-h-screen flex-col justify-between bg-white px-6 py-10 text-center md:py-14">
      {/* Content */}
      <div className="flex-1 md:mx-auto md:max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          What are you great at?
        </h1>
        <p className="mt-2 text-gray-600 md:text-lg">
          Add skills you can offer and skills you're looking for in return.
        </p>

        {/* Your Skills */}
        <div className="mt-8 space-y-4 text-left">
          <label className="block font-medium text-gray-800 md:text-lg">
            Your Skills
          </label>

          <div className="flex items-center rounded-xl border border-gray-300 px-4 py-2">
            <input
              type="text"
              placeholder="e.g. Web Design"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              className="flex-1 bg-transparent outline-none"
            />
            <button onClick={addSkill}>
              <Plus className="text-gray-500" size={20} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-red-600"
              >
                {s}
                <button onClick={() => removeSkill(s)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div className="mt-8 space-y-4 text-left">
          <label className="block font-medium text-gray-800 md:text-lg">
            Looking for
          </label>

          <div className="flex items-center rounded-xl border border-gray-300 px-4 py-2">
            <input
              type="text"
              placeholder="e.g. SEO, Copywriting"
              value={lookingInput}
              onChange={(e) => setLookingInput(e.target.value)}
              onKeyPress={handleLookingKeyPress}
              className="flex-1 bg-transparent outline-none"
            />
            <button onClick={addLooking}>
              <Plus className="text-gray-500" size={20} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {lookingFor.map((s) => (
              <span
                key={s}
                className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-red-600"
              >
                {s}
                <button onClick={() => removeLooking(s)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div>
        <ProgressBar total={3} current={step} onChange={onGoTo} />
        <Button
          onClick={saveSkills}
          className="mx-auto mt-6 w-full bg-[#FF2E2E]"
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default SkillDiscovery;
