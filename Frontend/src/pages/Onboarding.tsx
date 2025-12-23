import { useState } from 'react';
import WelcomeTour from '@/components/onboarding/WelcomeTour';
import SkillDiscovery from '@/components/onboarding/SkillDiscovery';
import ConnectAndTrade from '@/components/onboarding/ConnectAndTrade';

const Onboarding = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 2));
  };
  const goToStep = (index: number) => setStep(index);

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl">
      {/* {screens[step]} */}
      {step === 0 && (
        <WelcomeTour onNext={nextStep} onGoTo={goToStep} step={step} />
      )}
      {step === 1 && (
        <SkillDiscovery onNext={nextStep} onGoTo={goToStep} step={step} />
      )}
      {step === 2 && <ConnectAndTrade onGoTo={goToStep} step={step} />}
    </main>
  );
};

export default Onboarding;
