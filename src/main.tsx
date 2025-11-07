import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// make them available globally for libs
// // @ts-ignore
// if (!(window as any).Buffer) (window as any).Buffer = Buffer;
// // @ts-ignore
// if (!(window as any).process) (window as any).process = process;

createRoot(document.getElementById('root')!).render(
    <App/>
)
