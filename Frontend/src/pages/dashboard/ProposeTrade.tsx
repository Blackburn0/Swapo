import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Camera, ChevronLeft, Code, PencilRuler, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const account = [
  {
    icon: PencilRuler,
    skill: 'Photography',
    experience: 3,
  },
  {
    icon: Camera,
    skill: 'Web Design',
    experience: 2,
  },
  {
    icon: Code,
    skill: 'Web Development',
    experience: 5,
  },
];

const ProposeTrade = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null); // selected card index

  return (
    <div className="mx-auto my-2 flex min-h-screen max-w-xl flex-col pb-20">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold">Propose a Trade</h1>
        </div>
      </div>

      <div className="space-y-4 bg-stone-50/50 px-4 pt-4">
        {/* Skills */}
        <h2 className="my-3 text-left text-[20px] font-bold text-gray-900">
          Select a Skill to offer
        </h2>
        {account.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(idx)}
            className={`flex cursor-pointer items-center space-x-4 rounded-lg p-4 shadow-xs transition-all hover:bg-gray-50 ${selected === idx ? 'border-2 border-red-500 bg-red-100/30' : 'border border-transparent bg-white'} `}
          >
            <div className="rounded-sm border-transparent bg-red-100/50 p-2.5 text-gray-700">
              <item.icon size={20} />
            </div>
            <div className="flex-1 text-left text-gray-500">
              <p className="text-base font-bold">{item.skill}</p>
              <p className="text-sm font-medium">
                {item.experience} year(s) experience
              </p>
            </div>
            {/* Checkbox */}
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-red-500 transition-all ${
                selected === idx ? 'bg-red-500' : 'bg-white'
              }`}
            >
              {selected === idx && <Check size={14} className="text-white" />}
            </div>
          </div>
        ))}

        {/* Message */}
        <div>
          <h2 className="my-3 text-left text-[20px] font-bold text-gray-900">
            Add a message (optional)
          </h2>
          <Input
            textarea
            placeholder="Hi! I'm interested in trading my graphic design skills for your copywriting services. I'm a big fan of your work and I think we could create something amazing together."
          />
        </div>

        {/* CTA Buttons */}
        <div>
          <Button onClick={() => navigate('/app/dashboard/propose-trade')}>
            Propose Trade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProposeTrade;
