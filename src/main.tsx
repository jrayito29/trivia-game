import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import { Menu } from './Pages/Menu.tsx';
import { Game } from './Pages/Game.tsx';
import { Topics } from './Pages/Topics.tsx';
import { Panel } from './Pages/Panel.tsx';
import { Rules } from './Pages/Rules.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="game" element={<Game />} />
            <Route path="topics" element={<Topics />} />
            <Route path="panel" element={<Panel />} />
            <Route path="rules" element={<Rules />} />
        </Routes>
    </BrowserRouter>
)
