import Button from '@/components/ui/Button';

import {
  ChevronLeft,
  PencilRuler,
  ChevronDown,
  ArrowLeftRight,
  MapPin,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const account = [
  {
    icon: PencilRuler,
    skill: 'Select a skill',
    title: 'Skill Offered',
  },
  {
    icon: ArrowLeftRight,
    skill: 'Select a skill',
    title: 'Skill Desired',
  },
  {
    icon: MapPin,
    skill: 'Select a location',
    title: 'Location',
  },
];

const avalability = ['Full-time', 'Part-time', 'Flexible'];

const Filters = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mx-auto my-2 flex min-h-screen max-w-xl flex-col justify-between pb-20">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold">Filters</h1>
        </div>
        <div className="absolute right-4 cursor-pointer text-sm font-medium text-red-600 underline-offset-2 hover:underline">
          Reset
        </div>
      </div>

      <div className="space-y-4 bg-stone-50/50 px-4 pt-4">
        {/* Skills */}
        {account.map((item, idx) => (
          <div
            key={idx}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-50"
          >
            {/* Icon + Text Row */}
            <div className="flex items-center space-x-4 text-left">
              <div className="rounded-sm border-transparent bg-red-100/50 p-2.5 text-gray-700">
                <item.icon size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {item.skill}
                </h2>
                <p className="text-sm text-gray-500">{item.title}</p>
              </div>
            </div>

            {/* Chevron */}
            <ChevronDown size={24} className="text-gray-400" />
          </div>
        ))}

        {/* Availability */}
        <div>
          <h2 className="my-3 text-left text-[20px] font-bold text-gray-900">
            Availability
          </h2>
          <div className="flex flex-col space-y-3">
            {avalability.map((avail, idx) => (
              <div
                key={idx}
                onClick={() => setSelected(idx)}
                className={`flex cursor-pointer items-center space-x-4 rounded-lg border p-4 shadow-sm transition-all ${selected === idx ? 'border-red-500 bg-red-100/30' : 'border-gray-200 bg-white'} `}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 transition-all ${
                    selected === idx ? 'bg-red-500' : 'bg-white'
                  }`}
                >
                  {selected === idx && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <p className="font-medium text-gray-700">{avail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-10 px-4">
        <Button onClick={() => navigate('/dashboard')}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default Filters;
