import React from 'react';
import { Fish, Waves, Calculator, TrendingUp, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'sanctuary', label: 'Virtual Sanctuary', icon: Fish },
    { id: 'calculator', label: 'Waste Calculator', icon: Calculator },
    { id: 'insights', label: 'Ocean Insights', icon: TrendingUp },
    { id: 'profile', label: 'My Impact', icon: User },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-teal-400/10 animate-pulse"></div>
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Waves className="w-8 h-8 text-blue-300 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BlueConserve</h1>
              <p className="text-blue-300 text-sm">Virtual Marine Sanctuary</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-blue-200 hover:text-white hover:bg-blue-700/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex space-x-2 overflow-x-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;