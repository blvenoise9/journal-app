import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-white text-3xl font-jersey tracking-wide">DreamMachine 1999</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto bg-black min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black border-t border-gray-800">
        <div className="flex items-center justify-around py-3">
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 px-4 py-2 ${
              isActive('/') ? 'text-white' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to="/new"
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full"
          >
            <Plus className="w-6 h-6 text-black" />
          </Link>

          <Link
            to="/memories"
            className={`flex flex-col items-center space-y-1 px-4 py-2 ${
              isActive('/memories') ? 'text-white' : 'text-gray-500'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs">Memories</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}; 