import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do I list my skills?',
    answer:
      'Go to your profile, tap on "Add Skill," and fill in the skill name, description, and proficiency level. Save to make it visible to others.',
  },
  {
    question: 'How do I find a skill to trade?',
    answer:
      'Use the Browse tab to explore available skills from other users. Filter by category or location to find the perfect match.',
  },
  {
    question: 'How do I schedule a trade?',
    answer:
      'Once you’ve matched with a user, open Messages to agree on a schedule and confirm the trade directly from the chat.',
  },
  {
    question: 'Is my personal information safe?',
    answer:
      'Yes. Your personal data is protected and only shared when necessary for skill exchanges, according to our privacy policy.',
  },
];

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="flex min-h-screen flex-col bg-white px-6 text-gray-900 dark:bg-black">
      {/* Header */}
      <header className="flex items-center border-b py-4">
        <button
          onClick={() => window.history.back()}
          className="cursor-pointer text-base font-medium text-gray-700 dark:text-white"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-black dark:text-white">
          Help Center
        </h1>
        <div className="w-5" /> {/* spacing placeholder for alignment */}
      </header>

      {/* Main Section */}
      <section className="mx-auto w-full max-w-xl flex-1 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          Common Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-white shadow-sm dark:bg-gray-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp
                    size={18}
                    className="cursor-pointer text-gray-600 dark:text-gray-200"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="cursor-pointer text-gray-600 dark:text-gray-200"
                  />
                )}
              </button>

              {openIndex === index && (
                <div className="border-t border-gray-100 p-4 text-left text-sm leading-relaxed text-gray-600 dark:text-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HelpCenter;
