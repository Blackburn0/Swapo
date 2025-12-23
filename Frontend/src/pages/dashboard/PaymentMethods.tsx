import Button from '@/components/ui/Button';
import {
  ChevronLeft,
  CreditCard,
  CreditCardIcon,
  Edit2Icon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const account = [
  {
    icon: CreditCard,
    title: 'Visa ending in 4242',
    expirationDate: 'Expires 03/2026',
    isExpiringSoon: false,
  },
  {
    icon: CreditCardIcon,
    title: 'MasterCard ending in 1234',
    expirationDate: 'Expires 11/2025',
    isExpiringSoon: true,
  },
];

const PaymentMethods = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-stone-50 py-2 pb-20 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Payment Methods
          </h1>
        </div>
      </div>

      <div className="space-y-4 bg-stone-50/50 px-4 pt-4 dark:bg-gray-900">
        {account.map((item, idx) => (
          <div
            key={idx}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {/* Icon + Text */}
            <div className="flex items-center space-x-4 text-left">
              <div className="rounded-sm border-transparent bg-red-100/50 p-2.5 text-gray-700 dark:bg-red-200/20 dark:text-red-500">
                <item.icon size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-black dark:text-gray-100">
                  {item.title}
                </h2>
                <p
                  className={`text-sm ${
                    item.isExpiringSoon
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {item.expirationDate}
                </p>
              </div>
            </div>

            {/* Edit Icon */}
            <Edit2Icon className="text-gray-600 dark:text-gray-300" size={18} />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-10 px-4">
        <Button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <CreditCardIcon size={20} />
          <h3 className="text-base font-medium">Add New Card</h3>
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
