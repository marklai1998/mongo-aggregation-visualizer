import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from '@/components/ui/provider';
import { HoveringFieldProvider } from '@/hooks/useHoveringField.ts';
import { App } from './App.tsx';

const root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <StrictMode>
      <Provider>
        <HoveringFieldProvider>
          <App />
        </HoveringFieldProvider>
      </Provider>
    </StrictMode>,
  );
