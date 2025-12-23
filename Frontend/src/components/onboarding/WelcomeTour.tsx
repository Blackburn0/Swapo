import Button from '@/components/ui/Button';
import ProgressBar from './ProgressBar';
import { ArrowRight, Code2, Music, Wrench } from 'lucide-react';
import myImage from '@/assets/images/20770304_Sandy_Eco-08_Single-02-removebg-preview.png';

interface WelcomeTourProps {
  onNext: () => void;
  onGoTo: (index: number) => void;
  step: number;
}

// const WelcomeTour = ({ onNext }: WelcomeTourProps) => {
const WelcomeTour = ({ onNext, onGoTo, step }: WelcomeTourProps) => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#FF4D4D] via-[#FFE5E5] to-white px-6 py-10 text-center">
      {/* Icons */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute top-0 right-10 rounded-full bg-white p-4 shadow-md">
            <Code2 className="text-black" size={22} />
          </div>
          <div className="absolute bottom-0 left-10 rounded-full bg-white p-4 shadow-md">
            <Music className="text-black" size={22} />
          </div>
          <div className="absolute right-[-1rem] bottom-0 rounded-full bg-white p-4 shadow-md">
            <Wrench className="text-black" size={22} />
          </div>

          <div
            className="h-64 w-64 bg-contain bg-center bg-no-repeat opacity-70"
            style={{ backgroundImage: `url(${myImage})` }}
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Trade your skills, unlock new ones
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Exchange your expertise with others and learn new skills in return.
          </p>
        </div>
      </div>

      {/* Progress + Button */}
      <div className="w-full space-y-6">
        <ProgressBar total={3} current={step} onChange={onGoTo} />

        <Button
          onClick={onNext}
          className="flex items-center justify-center gap-2 bg-[#FF2E2E]"
        >
          Get Started
          <ArrowRight size={20} />
        </Button>
      </div>
    </section>
  );
};

export default WelcomeTour;
