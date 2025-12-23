import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white px-4 py-8 pt-20 text-center">
      <div className="my-10 text-4xl font-bold text-red-600">Swapo</div>
      <div>
        <h1 className="mb-5 text-3xl font-bold">
          Trade your skills, unlock new ones
        </h1>
        <p className="text-base font-medium text-gray-700">
          {' '}
          Connect with others to exchange your expertise and learn new skills.
        </p>
      </div>
      <div className="mt-12 space-y-4">
        <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        <Button variant="outline" onClick={() => navigate('/login')}>
          Log in
        </Button>
      </div>
    </div>
  );
};

export default Home;
