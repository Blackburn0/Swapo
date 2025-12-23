import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './components/routing/AppRoutes';
import '@/index.css';
import { AuthProvider } from './context/AuthContext';
import MobileOnlyWrapper from './components/MobileOnlyWrapper';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MobileOnlyWrapper>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </MobileOnlyWrapper>
    </QueryClientProvider>
  );
};

export default App;
