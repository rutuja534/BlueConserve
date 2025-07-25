import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Homepage from './components/Homepage';
import WasteCalculator from './components/WasteCalculator';
import VirtualSanctuary from './components/VirtualSanctuary';
import EcoTips from './components/EcoTips';
import Community from './components/Community';

interface UserData {
  plasticUse: number;
  seafoodConsumption: number;
  transportation: string;
  waterUsage: number;
  oceanHealthScore: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState<UserData>({
    plasticUse: 5,
    seafoodConsumption: 3,
    transportation: 'car',
    waterUsage: 15,
    oceanHealthScore: 65
  });
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [pledgeCount, setPledgeCount] = useState(12345);
  const [userHasPledged, setUserHasPledged] = useState(false);

  // Floating particles animation
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);

  useEffect(() => {
    // Initialize floating particles
    const initialParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5
    }));
    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + 0.1) % 100,
        y: particle.y + Math.sin(Date.now() / 1000 + particle.id) * 0.1
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage setActiveTab={setActiveTab} />;
      case 'calculator':
        return <WasteCalculator userData={userData} setUserData={setUserData} setActiveTab={setActiveTab} />;
      case 'sanctuary':
        return <VirtualSanctuary userData={userData} />;
      case 'tips':
        return <EcoTips userData={userData} completedTips={completedTips} setCompletedTips={setCompletedTips} />;
      case 'community':
        return <Community pledgeCount={pledgeCount} setPledgeCount={setPledgeCount} userHasPledged={userHasPledged} setUserHasPledged={setUserHasPledged} />;
      case 'insights':
        return <EcoTips userData={userData} completedTips={completedTips} setCompletedTips={setCompletedTips} />;
      case 'profile':
        return <Community pledgeCount={pledgeCount} setPledgeCount={setPledgeCount} userHasPledged={userHasPledged} setUserHasPledged={setUserHasPledged} />;
      default:
        return <Homepage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-blue-300/30 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `scale(${particle.size})`,
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="transition-all duration-500 ease-in-out">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default App;