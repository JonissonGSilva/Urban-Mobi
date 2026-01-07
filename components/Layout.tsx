
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';
import { Award, Bell, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userPoints?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, userPoints = 1250 }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 selection:bg-blue-100">
      {/* App Bar (Header) */}
      <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 w-10 h-10 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center">
            <Activity className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">Urban Mobi</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Alert & Planner</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-blue-50 pl-2 pr-3 py-1.5 rounded-2xl border border-blue-100">
            <div className="bg-blue-600 p-1 rounded-lg mr-2">
               <Award className="text-white" size={12} />
            </div>
            <span className="text-xs font-black text-blue-800">{userPoints}</span>
          </div>
          <button className="relative p-2 text-gray-600 active:scale-90 transition-all">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto pb-24 px-5 pt-6">
        {children}
      </main>

      {/* Navigation Rail (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-[2000]">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center py-2 px-1 min-w-[68px] transition-all duration-300 ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 scale-110 shadow-sm shadow-blue-100' : ''}`}>
                {/* Fixed TypeScript error by casting item.icon to React.ReactElement<any> to allow Lucide-specific props */}
                {React.cloneElement(item.icon as React.ReactElement<any>, { 
                  size: 24, 
                  strokeWidth: isActive ? 2.5 : 2,
                  fill: isActive ? "rgba(59, 130, 246, 0.1)" : "none"
                })}
              </div>
              <span className={`text-[10px] mt-1.5 font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75 h-0'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-3 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
