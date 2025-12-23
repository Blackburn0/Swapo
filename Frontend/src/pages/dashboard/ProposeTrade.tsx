import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Camera, ChevronLeft, Code, PencilRuler, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '@/utils/axiosInstance';
import type { Listing } from './Listing';
import { useToast } from '@/hooks/useToast';

interface Skill {
  id: number;
  skill_id: number;
  name: string;
  proficiency_level: string;
  icon: any;
}

const ProposeTrade = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();

  const listing: Listing = state?.listing;

  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me/');
        setProfile(res.data.user);
      } catch (err) {
        console.error('Failed to load user profile', err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile?.user_id) {
      return;
    }

    const fetchUserSkills = async () => {
      try {
        const res = await axios.get(`/user-skills/${profile?.user_id}/`);
        console.log('User skills API response:', res.data);
        const skills = (res.data.offerings || []).map((s: any) => ({
          id: s.user_skill_id,
          skill_id: s.skill,
          name: s.skill_name,
          experience: s.experience || 0,
          icon: s.skill_name.toLowerCase().includes('design')
            ? PencilRuler
            : s.skill_name.toLowerCase().includes('photography')
              ? Camera
              : Code,
        }));
        setUserSkills(skills);
      } catch (err) {
        showToast('Failed to fetch user skills', 'error');
        console.error('Failed to fetch user skills:', err);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchUserSkills();
  }, [profile]);

  const handleProposeTrade = async () => {
    if (!selectedSkill) return alert('Please select a skill to offer');
    if (!listing) return alert('Listing not found');

    // Find the selected skill to get its skill_id for the API
    const selectedSkillData = userSkills.find((s) => s.id === selectedSkill);
    if (!selectedSkillData) return alert('Selected skill not found');

    const payload = {
      listing: listing.listing_id,
      proposer: profile?.user_id,
      recipient: listing.user_id,
      skill_offered_by_proposer: selectedSkillData.skill_id,
      skill_desired_by_proposer: listing.skill_desired,
      message,
    };

    try {
      setSubmitting(true);
      const res = await axios.post('/trades/proposals/', payload);

      console.log('Propose Trade response:', res.data);

      showToast('Trade proposed successfully!', 'success');

      navigate(`/app/dashboard/proposal/${res.data.proposal_id}`);
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.detail || 'Failed to propose trade',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!listing) return <p className="p-10 text-center">Listing not found.</p>;
  //console.log('userSkills', userSkills);

  return (
    <div className="mx-auto my-2 flex min-h-screen max-w-xl flex-col pb-20">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-400/20 pt-2 pb-4 dark:border-gray-200">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold">Propose a Trade</h1>
        </div>
      </div>
      <div className="flex flex-col justify-between px-4">
        <div className="space-y-4 pt-4">
          {/* Listing info */}
          <div className="flex items-center gap-4 rounded-lg border border-gray-800/20 bg-transparent p-4 dark:border-gray-200">
            <img
              src={
                listing.user.profile_picture_url ||
                'https://img.icons8.com/office/40/person-female.png'
              }
              alt={listing.user.username}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex flex-col items-start space-y-2">
              <p className="text-md font-bold capitalize">
                {listing.user?.first_name && listing.user?.last_name
                  ? ` ${listing.user.first_name} ${listing.user.last_name}`
                  : listing.user?.username}
              </p>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Skill requested:{' '}
                <span className="ml-2 rounded-full border-transparent bg-red-600 px-6 py-1 text-white">
                  {listing.skill_desired_name}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            {/* Select a Skill to Offer */}
            <div>
              {/* Select a skill to offer */}
              <h2 className="my-3 text-left text-lg font-bold text-gray-900 dark:text-gray-300">
                Select a Skill to Offer
              </h2>

              {loadingSkills ? (
                <p>Loading your skills...</p>
              ) : userSkills.length === 0 ? (
                <p>You have no skills to offer.</p>
              ) : (
                <div className="flex flex-col space-y-3">
                  {userSkills.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSkill(s.id)}
                        className={`flex cursor-pointer items-center space-x-4 rounded-lg p-4 shadow-xs transition-all ${
                          selectedSkill === s.id
                            ? 'border border-red-800 bg-red-100/30 hover:bg-red-100 dark:hover:bg-red-900/50'
                            : 'border border-transparent bg-red-200 hover:bg-red-100 dark:bg-gray-900 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="rounded-sm border-transparent bg-red-100/50 p-2.5 text-gray-700 dark:text-gray-200">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 text-left text-gray-700 dark:text-gray-200">
                          <p className="text-base font-bold">{s.name}</p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            {s.proficiency_level} years
                          </p>
                        </div>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 transition-all ${
                            selectedSkill === s.id
                              ? 'bg-red-500'
                              : 'bg-white dark:bg-gray-300'
                          }`}
                        >
                          {selectedSkill === s.id && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <h2 className="my-3 text-left text-lg font-bold text-gray-900 dark:text-gray-300">
                Add a Message (Optional)
              </h2>
              <Input
                textarea
                placeholder="Hi! I'd like to trade my skills with you."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-gray-800 dark:text-gray-300"
              />
            </div>
          </div>
        </div>
        {/* Propose Trade Button */}
        <div className="mt-8">
          <Button
            onClick={handleProposeTrade}
            disabled={submitting || loadingSkills}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {submitting ? 'Proposing...' : 'Propose Trade'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProposeTrade;
