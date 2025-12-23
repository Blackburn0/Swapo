import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-5 md:px-8 border-b border-gray-100 max-w-xl mx-auto w-full">
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          About
        </h1>
        <div className="w-6" /> {/* spacing placeholder */}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-xl mx-auto space-y-8">
          {/* App Information */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">
              App Information
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
              <span className="text-gray-800 font-medium text-sm">
                Version
              </span>
              <span className="text-gray-600 text-sm">1.0.0</span>
            </div>
          </section>

          {/* Legal Section */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">Legal</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-200">
              {/* Terms of Service */}
              <div
                onClick={() => toggleSection("terms")}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <span className="text-gray-800 font-medium text-sm">
                  Terms of Service
                </span>
                {openSection === "terms" ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>
              {openSection === "terms" && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  By using SkillSwap, you agree to our terms and conditions,
                  which outline user responsibilities, acceptable use, and data
                  handling practices.
                </div>
              )}

              {/* Privacy Policy */}
              <div
                onClick={() => toggleSection("privacy")}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <span className="text-gray-800 font-medium text-sm">
                  Privacy Policy
                </span>
                {openSection === "privacy" ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>
              {openSection === "privacy" && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  We respect your privacy. Your data is stored securely and will
                  never be shared without your consent. Read our policy to
                  understand how we handle information.
                </div>
              )}

              {/* FAQs */}
              <div
                onClick={() => toggleSection("faqs")}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <span className="text-gray-800 font-medium text-sm">FAQs</span>
                {openSection === "faqs" ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>
              {openSection === "faqs" && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
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
