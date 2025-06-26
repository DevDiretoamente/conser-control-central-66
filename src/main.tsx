
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx - Inicializando aplicação React');

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('main.tsx - Elemento root não encontrado!');
  throw new Error('Root element not found');
}

console.log('main.tsx - Elemento root encontrado, renderizando App');

createRoot(rootElement).render(<App />);

console.log('main.tsx - App renderizado com sucesso');
