import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import axios from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/context/AuthContext';

const Privacy = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [publicProfile, setPublicProfile] = useState(true);
  const [publicSkills, setPublicSkills] = useState(true);
  const [publicTrades, setPublicTrades] = useState(false);
  const [contactOption, setContactOption] = useState<
    'Everyone' | 'People with mutual skills' | 'No one'
  >('Everyone');
  const [loading, setLoading] = useState(false);

  // Fetch privacy settings
  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const res = await axios.get('/auth/privacy/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setPublicProfile(data.public_profile);
        setPublicSkills(data.public_skills);
        setPublicTrades(data.public_trades);
        setContactOption(data.contact_option);
      } catch (error) {
        console.error('Failed to load privacy:', error);
        showToast('Failed to load privacy settings ❌', 'error');
      }
    };
    fetchPrivacy();
  }, [token]);

  // Save privacy changes
  const savePrivacy = async () => {
    try {
      setLoading(true);
      await axios.patch(
        '/auth/privacy/',
        {
          public_profile: publicProfile,
          public_skills: publicSkills,
          public_trades: publicTrades,
          contact_option: contactOption,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Privacy settings updated ✅', 'success');
    } catch (error) {
      console.error('Failed to update privacy:', error);
      showToast('Failed to update privacy settings ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-black flex min-h-screen flex-col px-6 pb-20 bg-gray-50">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-xl items-center justify-between py-5">
          <button
            onClick={() => window.history.back()}
            aria-label="back"
            className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-black/50"
          >
            <ChevronLeft size={26} className="text-gray-800 dark:text-white" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Privacy
          </h1>

          {/* Save button */}
          <button
            onClick={savePrivacy}
            disabled={loading}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 transition"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-xl space-y-6">
          {/* Profile Visibility Card */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-700">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Profile Visibility
              </h2>
            </div>

            <div className="divide-y divide-gray-100 text-left">
              {/* Public Profile */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Public Profile
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    Anyone can view your profile.
                  </p>
                </div>

                {/* toggle */}
                <button
                  onClick={() => setPublicProfile((v) => !v)}
                  aria-pressed={publicProfile}
                  className={clsx(
                    'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
                    publicProfile ? 'bg-red-500' : 'bg-gray-200',
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                      publicProfile ? 'translate-x-5' : 'translate-x-1',
                    )}
                  />
                </button>
              </div>

              {/* Public Skills */}
              <div className="flex items-start justify-between px-6 py-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Public Skills
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    Your skills are visible to everyone.
                  </p>
                </div>

                <button
                  onClick={() => setPublicSkills((v) => !v)}
                  aria-pressed={publicSkills}
                  className={clsx(
                    'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
                    publicSkills ? 'bg-red-500' : 'bg-gray-200',
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                      publicSkills ? 'translate-x-5' : 'translate-x-1',
                    )}
                  />
                </button>
              </div>

              {/* Public Trades */}
              <div className="flex items-start justify-between px-6 py-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Public Trades
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    Your trade history is public.
                  </p>
                </div>

                <button
                  onClick={() => setPublicTrades((v) => !v)}
                  aria-pressed={publicTrades}
                  className={clsx(
                    'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
                    publicTrades ? 'bg-red-500' : 'bg-gray-200',
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                      publicTrades ? 'translate-x-5' : 'translate-x-1',
                    )}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Who can contact me Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-200">
              Who can contact me
            </h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
              Choose who can send you trade requests and messages.
            </p>

            <div className="space-y-4">
              {/* Option: Everyone */}
              <label
                className={clsx(
                  'flex cursor-pointer items-center justify-between rounded-lg p-2',
                  contactOption === 'Everyone'
                    ? 'bg-red-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600',
                )}
              >
                <div className="flex items-center gap-3">
                  {/* custom radio */}
                  <span
                    className={clsx(
                      'inline-flex h-5 w-5 items-center justify-center rounded-full border',
                      contactOption === 'Everyone'
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300 bg-white',
                    )}
                  >
                    {contactOption === 'Everyone' && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>

                  <span
                    className={clsx(
                      'text-sm font-medium',
                      contactOption === 'Everyone'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-white',
                    )}
                  >
                    Everyone
                  </span>
                </div>

                <input
                  name="contact"
                  type="radio"
                  className="hidden"
                  checked={contactOption === 'Everyone'}
                  onChange={() => setContactOption('Everyone')}
                />
              </label>

              {/* Option: People with mutual skills */}
              <label
                className={clsx(
                  'flex cursor-pointer items-center justify-between rounded-lg p-2',
                  contactOption === 'People with mutual skills'
                    ? 'bg-red-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'inline-flex h-5 w-5 items-center justify-center rounded-full border',
                      contactOption === 'People with mutual skills'
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300 bg-white',
                    )}
                  >
                    {contactOption === 'People with mutual skills' && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>

                  <span
                    className={clsx(
                      'text-sm font-medium',
                      contactOption === 'People with mutual skills'
                        ? 'text-gray-900 dark:text-gray-200'
                        : 'text-gray-700 dark:text-white',
                    )}
                  >
                    People with mutual skills
                  </span>
                </div>

                <input
                  name="contact"
                  type="radio"
                  className="hidden"
                  checked={contactOption === 'People with mutual skills'}
                  onChange={() => setContactOption('People with mutual skills')}
                />
              </label>

              {/* Option: No one */}
              <label
                className={clsx(
                  'flex cursor-pointer items-center justify-between rounded-lg p-2',
                  contactOption === 'No one'
                    ? 'bg-red-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'inline-flex h-5 w-5 items-center justify-center rounded-full border',
                      contactOption === 'No one'
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300 bg-white',
                    )}
                  >
                    {contactOption === 'No one' && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>

                  <span
                    className={clsx(
                      'text-sm font-medium',
                      contactOption === 'No one'
                        ? 'text-gray-900 dark:text-gray-200'
                        : 'text-gray-700 dark:text-white',
                    )}
                  >
                    No one
                  </span>
                </div>

                <input
                  name="contact"
                  type="radio"
                  className="hidden"
                  checked={contactOption === 'No one'}
                  onChange={() => setContactOption('No one')}
                />
              </label>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom nav aligned to the same grid (max-w-xl) */}
      <nav className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-xl items-center justify-around py-2 md:py-3">
          <button className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-300">
            <span>Browse</span>
          </button>
          <button className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-300">
            <span>My Skills</span>
          </button>
          <button className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-300">
            <span>Messages</span>
          </button>
          <button className="flex flex-col items-center text-sm text-red-600">
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Privacy;



// import { useState } from 'react';
// import { ChevronLeft } from 'lucide-react';
// import clsx from 'clsx';

// const Privacy = () => {
//   // toggles
//   const [publicProfile, setPublicProfile] = useState(true);
//   const [publicSkills, setPublicSkills] = useState(true);
//   const [publicTrades, setPublicTrades] = useState(false);

//   // radio
//   const [contactOption, setContactOption] = useState<
//     'Everyone' | 'People with mutual skills' | 'No one'
//   >('Everyone');

//   return (
//     <div className="dark bg-gray-50:bg-black flex min-h-screen flex-col px-6 pb-20">
//       {/* Header */}
//       <header className="border-b">
//         <div className="mx-auto flex max-w-xl items-center justify-between py-5">
//           <button
//             onClick={() => window.history.back()}
//             aria-label="back"
//             className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-black/50"
//           >
//             <ChevronLeft size={26} className="text-gray-80 dark:text-white0" />
//           </button>

//           <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
//             Privacy
//           </h1>

//           {/* placeholder to center title */}
//           <div className="w-8" />
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-1 overflow-y-auto px-4 py-6">
//         <div className="mx-auto max-w-xl space-y-6">
//           {/* Profile Visibility Card */}
//           <section className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-700">
//             <div className="px-6 pt-6 pb-4">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
//                 Profile Visibility
//               </h2>
//             </div>

//             <div className="divide-y divide-gray-100 text-left">
//               {/* Public Profile */}
//               <div className="flex items-center justify-between px-6 py-4">
//                 <div className="flex-1 pr-4">
//                   <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
//                     Public Profile
//                   </p>
//                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
//                     Anyone can view your profile.
//                   </p>
//                 </div>

//                 {/* toggle */}
//                 <button
//                   onClick={() => setPublicProfile((v) => !v)}
//                   aria-pressed={publicProfile}
//                   className={clsx(
//                     'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
//                     publicProfile ? 'bg-red-500' : 'bg-gray-200',
//                   )}
//                 >
//                   <span
//                     className={clsx(
//                       'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
//                       publicProfile ? 'translate-x-5' : 'translate-x-1',
//                     )}
//                   />
//                 </button>
//               </div>

//               {/* Public Skills */}
//               <div className="flex items-start justify-between px-6 py-4">
//                 <div className="flex-1 pr-4">
//                   <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
//                     Public Skills
//                   </p>
//                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
//                     Your skills are visible to everyone.
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => setPublicSkills((v) => !v)}
//                   aria-pressed={publicSkills}
//                   className={clsx(
//                     'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
//                     publicSkills ? 'bg-red-500' : 'bg-gray-200',
//                   )}
//                 >
//                   <span
//                     className={clsx(
//                       'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
//                       publicSkills ? 'translate-x-5' : 'translate-x-1',
//                     )}
//                   />
//                 </button>
//               </div>

//               {/* Public Trades */}
//               <div className="flex items-start justify-between px-6 py-4">
//                 <div className="flex-1 pr-4">
//                   <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
//                     Public Trades
//                   </p>
//                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
//                     Your trade history is public.
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => setPublicTrades((v) => !v)}
//                   aria-pressed={publicTrades}
//                   className={clsx(
//                     'relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
//                     publicTrades ? 'bg-red-500' : 'bg-gray-200',
//                   )}
//                 >
//                   <span
//                     className={clsx(
//                       'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
//                       publicTrades ? 'translate-x-5' : 'translate-x-1',
//                     )}
//                   />
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* Who can contact me Card */}
//           <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-700">
//             <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-200">
//               Who can contact me
//             </h3>
//             <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
//               Choose who can send you trade requests and messages.
//             </p>

//             <div className="space-y-4">
//               {/* Option: Everyone */}
//               <label
//                 className={clsx(
//                   'flex cursor-pointer items-center justify-between rounded-lg p-2',
//                   contactOption === 'Everyone'
//                     ? 'bg-red-50 dark:bg-gray-800'
//                     : 'hover:bg-gray-50 dark:hover:bg-gray-600',
//                 )}
//               >
//                 <div className="flex items-center gap-3">
//                   {/* custom radio */}
//                   <span
//                     className={clsx(
//                       'inline-flex h-5 w-5 items-center justify-center rounded-full border',
//                       contactOption === 'Everyone'
//                         ? 'border-red-500 bg-red-500'
//                         : 'border-gray-300 bg-white',
//                     )}
//                   >
//                     {contactOption === 'Everyone' && (
//                       <span className="h-2 w-2 rounded-full bg-white" />
//                     )}
//                   </span>

//                   <span
//                     className={clsx(
//                       'text-sm font-medium',
//                       contactOption === 'Everyone'
//                         ? 'text-gray-900 dark:text-white'
//                         : 'text-gray-700 dark:text-white',
//                     )}
//                   >
//                     Everyone
//                   </span>
//                 </div>

//                 <input
//                   name="contact"
//                   type="radio"
//                   className="hidden"
//                   checked={contactOption === 'Everyone'}
//                   onChange={() => setContactOption('Everyone')}
//                 />
//               </label>

//               {/* Option: People with mutual skills */}
//               <label
//                 className={clsx(
//                   'flex cursor-pointer items-center justify-between rounded-lg p-2',
//                   contactOption === 'People with mutual skills'
//                     ? 'bg-red-50 dark:bg-gray-800'
//                     : 'hover:bg-gray-50 dark:hover:bg-gray-600',
//                 )}
//               >
//                 <div className="flex items-center gap-3">
//                   <span
//                     className={clsx(
//                       'inline-flex h-5 w-5 items-center justify-center rounded-full border',
//                       contactOption === 'People with mutual skills'
//                         ? 'border-red-500 bg-red-500'
//                         : 'border-gray-300 bg-white',
//                     )}
//                   >
//                     {contactOption === 'People with mutual skills' && (
//                       <span className="h-2 w-2 rounded-full bg-white" />
//                     )}
//                   </span>

//                   <span
//                     className={clsx(
//                       'text-sm font-medium',
//                       contactOption === 'People with mutual skills'
//                         ? 'text-gray-900 dark:text-gray-200'
//                         : 'text-gray-700 dark:text-white',
//                     )}
//                   >
//                     People with mutual skills
//                   </span>
//                 </div>

//                 <input
//                   name="contact"
//                   type="radio"
//                   className="hidden"
//                   checked={contactOption === 'People with mutual skills'}
//                   onChange={() => setContactOption('People with mutual skills')}
//                 />
//               </label>

//               {/* Option: No one */}
//               <label
//                 className={clsx(
//                   'flex cursor-pointer items-center justify-between rounded-lg p-2',
//                   contactOption === 'No one'
//                     ? 'bg-red-50 dark:bg-gray-800'
//                     : 'hover:bg-gray-50 dark:hover:bg-gray-600',
//                 )}
//               >
//                 <div className="flex items-center gap-3">
//                   <span
//                     className={clsx(
//                       'inline-flex h-5 w-5 items-center justify-center rounded-full border',
//                       contactOption === 'No one'
//                         ? 'border-red-500 bg-red-500'
//                         : 'border-gray-300 bg-white',
//                     )}
//                   >
//                     {contactOption === 'No one' && (
//                       <span className="h-2 w-2 rounded-full bg-white" />
//                     )}
//                   </span>

//                   <span
//                     className={clsx(
//                       'text-sm font-medium',
//                       contactOption === 'No one'
//                         ? 'text-gray-900 dark:text-gray-200'
//                         : 'text-gray-700 dark:text-white',
//                     )}
//                   >
//                     No one
//                   </span>
//                 </div>

//                 <input
//                   name="contact"
//                   type="radio"
//                   className="hidden"
//                   checked={contactOption === 'No one'}
//                   onChange={() => setContactOption('No one')}
//                 />
//               </label>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Bottom nav aligned to the same grid (max-w-xl) */}
//       <nav className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white">
//         <div className="mx-auto flex max-w-xl items-center justify-around py-2 md:py-3">
//           <button className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-300">
//             <span>Browse</span>
//           </button>
//           <button className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-300">
//             <span>My Skills</span>
//           </button>
//           <button className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-300">
//             <span>Messages</span>
//           </button>
//           <button className="flex flex-col items-center text-sm text-red-600">
//             <span>Profile</span>
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Privacy;
