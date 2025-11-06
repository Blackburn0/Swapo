import Button from '@/components/ui/Button';
import ProgressBar from './ProgressBar';
import myImage from '@/assets/images/microsites-illustration.png';
import { useNavigate } from 'react-router-dom';

interface ConnectAndTradeProps {
  onGoTo: (index: number) => void;
  step: number;
}

const ConnectAndTrade = ({ step, onGoTo }: ConnectAndTradeProps) => {
  const navigate = useNavigate();
  return (
    <section className="flex min-h-screen flex-col justify-between bg-white px-6 py-10 text-center">
      <div className="mt-10 flex flex-col items-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Connect & Trade</h1>
        <p className="max-w-md leading-relaxed text-gray-600">
          Find people with skills you need and offer your own in return. It's a
          community of mutual growth and support.
        </p>
      </div>

      <div className="flex justify-center">
        <img
          src={myImage}
          alt="Connect and Trade illustration"
          className="mt-10 h-auto w-full max-w-[360px] object-contain"
        />
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Progress */}
        {/* <div className="flex justify-center space-x-2">
          <span className="w-8 h-1 bg-gray-200 rounded-full"></span>
          <span className="w-8 h-1 bg-gray-200 rounded-full"></span>
          <span className="w-8 h-1 bg-[#FF4D4D] rounded-full"></span>
        </div> */}
        <ProgressBar total={3} current={step} onChange={onGoTo} />

        <Button
          className="bg-[#FF2E2E] py-3 text-lg font-semibold"
          onClick={() => navigate('/app/dashboard/listing')}
        >
          Start Browsing
        </Button>
      </div>
    </section>
  );
};

export default ConnectAndTrade;
