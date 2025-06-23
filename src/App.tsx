import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import MainLayout from './components/layout/MainLayout.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import './index.css';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Handle ResizeObserver issues with animations
  useLayoutEffect(() => {
    // Force a reflow to prevent ResizeObserver loops with initial animations
    const forceReflow = () => {
      document.body.offsetHeight;
    };

    const timeoutId = setTimeout(forceReflow, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  console.log('🎵 chocolateey loaded with modern design');
  console.log('🔧 Configuración inicial:', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MainLayout />
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
