import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const About = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-xl items-center justify-between border-b border-gray-100 px-4 py-5 md:px-8">
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
          About
        </h1>
        <div className="w-6" /> {/* spacing placeholder */}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-xl space-y-8">
          {/* App Information */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">
              App Information
            </h2>

            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
              <span className="text-sm font-medium text-gray-800">Version</span>
              <span className="text-sm text-gray-600">1.0.0</span>
            </div>
          </section>

          {/* Legal Section */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">Legal</h2>

            <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-gray-50">
              {/* Terms of Service */}
              <div
                onClick={() => toggleSection('terms')}
                className="flex cursor-pointer items-center justify-between px-4 py-4 transition hover:bg-gray-100"
              >
                <span className="text-sm font-medium text-gray-800">
                  Terms of Service
                </span>
                {openSection === 'terms' ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>
              {openSection === 'terms' && (
                <div className="px-4 pb-4 text-sm leading-relaxed text-gray-600">
                  By using Swapo, you agree to our terms and conditions, which
                  outline user responsibilities, acceptable use, and data
                  handling practices.
                </div>
              )}

              {/* Privacy Policy */}
              <div
                onClick={() => toggleSection('privacy')}
                className="flex cursor-pointer items-center justify-between px-4 py-4 transition hover:bg-gray-100"
              >
                <span className="text-sm font-medium text-gray-800">
                  Privacy Policy
                </span>
                {openSection === 'privacy' ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>
              {openSection === 'privacy' && (
                <div className="px-4 pb-4 text-sm leading-relaxed text-gray-600">
                  We respect your privacy. Your data is stored securely and will
                  never be shared without your consent. Read our policy to
                  understand how we handle information.
                </div>
              )}

              {/* FAQs */}
              <div
                onClick={() => toggleSection('faqs')}
                className="flex cursor-pointer items-center justify-between px-4 py-4 transition hover:bg-gray-100"
              >
                <span className="text-sm font-medium text-gray-800">FAQs</span>
                {openSection === 'faqs' ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>
              {openSection === 'faqs' && (
                <div className="px-4 pb-4 text-sm leading-relaxed text-gray-600">
                  Have questions? Visit our FAQ section to find answers about
                  trading skills, managing your profile, and connecting with
                  others.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
