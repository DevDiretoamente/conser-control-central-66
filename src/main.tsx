
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SecureAuthProvider } from './contexts/SecureAuthContext'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById("root")!).render(
  <SecureAuthProvider>
    <App />
    <Toaster />
  </SecureAuthProvider>
);
