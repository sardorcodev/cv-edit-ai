import { FileText, Gamepad2, Home, Search } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Zamonaviy Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                DevMatch AI
              </span>
              <span className="text-xs font-mono text-gray-500 mt-1">by sardorcodev</span>
            </Link>
            
            <div className="flex gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Home size={18} /> Asosiy
              </Link>
              <Link to="/builder" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <FileText size={18} /> CV Builder
              </Link>
              <Link to="/analyzer" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Search size={18} /> Tahlil
              </Link>
              <Link to="/game" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Gamepad2 size={18} /> AI Arena
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sahifalar shu yerda o'zgaradi */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}