
import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.tsx'
import './index.css'

console.log('main.tsx - Inicializando aplicação React SIMPLES');

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('main.tsx - Elemento root não encontrado!');
  throw new Error('Root element not found');
}

console.log('main.tsx - Elemento root encontrado, renderizando SimpleApp');

createRoot(rootElement).render(<SimpleApp />);

console.log('main.tsx - SimpleApp renderizado com sucesso');
