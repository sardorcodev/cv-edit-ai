import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CvBuilder from './pages/CvBuilder';
import CvAnalyzer from './pages/CvAnalyzer';
import GameEngine from './pages/GameEngine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="builder" element={<CvBuilder />} />
          <Route path="analyzer" element={<CvAnalyzer />} />
          <Route path="game" element={<GameEngine />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;