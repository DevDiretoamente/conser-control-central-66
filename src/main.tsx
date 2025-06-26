
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Initializing React app');

createRoot(document.getElementById("root")!).render(
  <App />
);
