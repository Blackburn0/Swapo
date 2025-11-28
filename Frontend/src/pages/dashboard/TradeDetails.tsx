import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const account = [
  {
    title: 'Skill Offered',
    skill: 'Photography',
    subTitle: 'Professional Portrait Photography',
    desc: "I'll capture stunning portraits for your personal or professional needs",
    img: 'https://img.icons8.com/office/40/person-male.png',
  },
  {
    title: 'Skill Desired',
    skill: 'Web Design',
    subTitle: 'Responsive Website Design',
    desc: 'Need a website that looks great on any device. I want it tailored to my brand.',
    img: 'https://img.icons8.com/office/40/person-male.png',
  },
];

const TradeDetails = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="mx-auto my-2 flex min-h-screen max-w-xl flex-col pb-17">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold">Trade Details</h1>
        </div>
      </div>

      <div className="space-y-4 bg-stone-50/50 px-4 pt-4">
        {/* Skills */}
        {account.map((item, idx) => (
          <div
            key={idx}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
          >
            <div className="w-[65.5%] text-left">
              <h2 className="my-3 text-[20px] font-bold text-gray-900">
                {item.title}
              </h2>
              <p className="text-sm font-medium text-red-800">{item.skill}</p>
              <p className="mb-3 text-lg font-bold">{item.subTitle}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <div className="rounded-xl border-transparent bg-stone-100 p-4 shadow-sm">
              <img
                src={item.img}
                alt="Skill Thumbnail"
                className="h-25 w-25 rounded-full"
              />
            </div>
          </div>
        ))}

        {/* Description */}
        <div className="rounded-lg bg-white p-4 text-left shadow-md hover:bg-gray-50">
          <h2 className="text-[20px] font-bold text-gray-900">Description</h2>
          <p className="mt-2 text-sm text-gray-500">
            I'm a professional photographer with 5+ years of experience in
            portrait photography. I'm looking to trade my photography services
            for a responsive website design. I need a website for my photography
            portfolio that showcases my work and attracts potential clients.
          </p>
        </div>

        {/* About Trader */}
        <div className="mb-10 rounded-lg bg-white p-4 shadow-md hover:bg-gray-50">
          <div className="text-left">
            <span className="text-lg font-bold text-gray-900">
              About the Trader
            </span>
          </div>
          <div className="mt-4 mb-2 flex items-center space-x-4 text-left">
            <img
              src="https://img.icons8.com/office/40/person-male.png"
              alt="Trader"
              className="h-16 w-16 rounded-full"
            />
            <div>
              <p className="font-bold">
                {isAuthenticated ? user?.email : 'John Doe'}
              </p>
              <p className="font-medium text-red-800">Photographer</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-4">
          <Button onClick={() => navigate('/app/dashboard/propose-trade')}>
            Propose Trade
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/app/dashboard/messages')}
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;
