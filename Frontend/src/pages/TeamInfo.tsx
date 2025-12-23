import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

const TeamInfo = () => {
  const { showToast } = useToast();
  return (
    <div className="px-4">
      {/* Button and Toast example usage */}
      <div className="mt-20 flex w-60 flex-col gap-4">
        <h1 className="text-2xl font-bold"> Button and Toast example usage </h1>
        <Button onClick={() => showToast('Saved successfully!', 'success')}>
          Success Toast
        </Button>

        <Button
          variant="secondary"
          onClick={() => showToast('Something went wrong!', 'error')}
        >
          Error Toast
        </Button>

        <Button
          variant="outline"
          onClick={() => showToast('This is some information.', 'info')}
        >
          Info Toast
        </Button>
        <Button
          disabled
          fullWidth
          onClick={() => showToast('This is some information.', 'info')}
        >
          Info Toast
        </Button>
      </div>

      {/* input example */}
      <div className="my-20">
        <h2 className="text-2xl font-bold">Input example</h2>
        {/* 1. Text Input */}
        <Input type="text" label="Full Name" />
        {/*  2. Full Width Input */}
        <Input type="email" label="Email Address" fullWidth />
        {/*  3. Textarea */}
        <Input textarea label="Message" rows={4} fullWidth />
        {/*  4. With Error Message */}
        <Input type="password" label="Password" error="Password is required" />
      </div>
    </div>
  );
};

export default TeamInfo;
