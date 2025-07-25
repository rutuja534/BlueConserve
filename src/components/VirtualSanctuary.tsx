import React, { useState, useEffect } from 'react';
import { Fish, Turtle, Star, Zap, Heart, AlertTriangle, Sun, Moon, Waves, Thermometer } from 'lucide-react';

interface MarineLife {
  id: string;
  type: 'fish' | 'turtle' | 'coral' | 'algae';
  x: number;
  y: number;
  health: number;
  size: number;
  speed: number;
  direction: number;
}

interface UserData {
  plasticUse: number;
  seafoodConsumption: number;
  transportation: string;
  waterUsage: number;
  oceanHealthScore: number;
}

interface VirtualSanctuaryProps {
  userData: UserData;
}

const VirtualSanctuary: React.FC<VirtualSanctuaryProps> = ({ userData }) => {
  const [marineLife, setMarineLife] = useState<MarineLife[]>([]);
  const [ecosystemHealth, setEcosystemHealth] = useState(75);
  const [wasteLevel, setWasteLevel] = useState(25);
  const [temperature, setTemperature] = useState(24);
  const [isDayMode, setIsDayMode] = useState(true);
  const [waterClarity, setWaterClarity] = useState(80);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedCreature, setSelectedCreature] = useState<string | null>(null);

  useEffect(() => {
    // Initialize marine life based on user data
    const baseHealth = userData.oceanHealthScore;
    const fishCount = Math.max(3, Math.floor(baseHealth / 15));
    const coralCount = Math.max(2, Math.floor(baseHealth / 25));
    
    const initialLife: MarineLife[] = [];
    
    // Add fish based on seafood consumption (fewer fish if high consumption)
    for (let i = 0; i < Math.max(2, fishCount - Math.floor(userData.seafoodConsumption / 2)); i++) {
      initialLife.push({
        id: `fish-${i}`,
        type: 'fish',
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
        health: Math.max(40, baseHealth + Math.random() * 20),
        size: 0.8 + Math.random() * 0.4,
        speed: 0.5 + Math.random() * 0.5,
        direction: Math.random() * 360
      });
    }
    
    // Add turtles (affected by plastic pollution)
    const turtleCount = userData.plasticUse < 5 ? 2 : userData.plasticUse < 10 ? 1 : 0;
    for (let i = 0; i < turtleCount; i++) {
      initialLife.push({
        id: `turtle-${i}`,
        type: 'turtle',
        x: 20 + Math.random() * 60,
        y: 40 + Math.random() * 40,
        health: Math.max(30, baseHealth - userData.plasticUse * 2),
        size: 1 + Math.random() * 0.5,
        speed: 0.2 + Math.random() * 0.3,
        direction: Math.random() * 360
      });
    }
    
    // Add coral reefs
    for (let i = 0; i < coralCount; i++) {
      initialLife.push({
        id: `coral-${i}`,
        type: 'coral',
        x: 15 + Math.random() * 70,
        y: 70 + Math.random() * 20,
        health: Math.max(20, baseHealth - (temperature - 22) * 5),
        size: 1.2 + Math.random() * 0.8,
        speed: 0,
        direction: 0
      });
    }

    setMarineLife(initialLife);
    setEcosystemHealth(userData.oceanHealthScore);
    setWasteLevel(Math.max(0, 100 - userData.oceanHealthScore));
    setTemperature(22 + (userData.transportation === 'flight' ? 3 : userData.transportation === 'car' ? 2 : 1));
    setWaterClarity(Math.max(30, userData.oceanHealthScore + 20));
  }, [userData]);

  useEffect(() => {
    if (!isAnimating) return;

    // Animate marine life movement
    const interval = setInterval(() => {
      setMarineLife(prev => prev.map(creature => {
        if (creature.type === 'fish' || creature.type === 'turtle') {
          // Calculate new position based on direction and speed
          const radians = (creature.direction * Math.PI) / 180;
          let newX = creature.x + Math.cos(radians) * creature.speed;
          let newY = creature.y + Math.sin(radians) * creature.speed * 0.5;
          
          // Bounce off walls
          let newDirection = creature.direction;
          if (newX <= 5 || newX >= 95) {
            newDirection = 180 - creature.direction;
            newX = Math.max(5, Math.min(95, newX));
          }
          if (newY <= 10 || newY >= 85) {
            newDirection = -creature.direction;
            newY = Math.max(10, Math.min(85, newY));
          }
          
          // Add some randomness to direction
          newDirection += (Math.random() - 0.5) * 20;
          
          return {
            ...creature,
            x: newX,
            y: newY,
            direction: newDirection,
          };
        }
        return creature;
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const addConservationAction = (action: string) => {
    switch (action) {
      case 'cleanup':
        setWasteLevel(prev => Math.max(0, prev - 15));
        setEcosystemHealth(prev => Math.min(100, prev + 8));
        setWaterClarity(prev => Math.min(100, prev + 10));
        
        // Add visual feedback
        const cleanupEffect = () => {
          // Remove some waste particles and improve water clarity
          setTimeout(() => {
            setWaterClarity(prev => Math.min(100, prev + 5));
          }, 500);
        };
        cleanupEffect();
        break;
        
      case 'temperature':
        setTemperature(prev => Math.max(20, prev - 1));
        setEcosystemHealth(prev => Math.min(100, prev + 5));
        
        // Improve coral health
        setMarineLife(prev => prev.map(creature => 
          creature.type === 'coral' 
            ? { ...creature, health: Math.min(100, creature.health + 10) }
            : creature
        ));
        break;
        
      case 'restore':
        const newCoral = {
          id: `coral-${Date.now()}`,
          type: 'coral' as const,
          x: 20 + Math.random() * 60,
          y: 70 + Math.random() * 20,
          health: 85,
          size: 1.2,
          speed: 0,
          direction: 0
        };
        setMarineLife(prev => [...prev, newCoral]);
        setEcosystemHealth(prev => Math.min(100, prev + 10));
        break;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-400';
    if (health >= 60) return 'text-yellow-400';
    if (health >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleCreatureClick = (creatureId: string) => {
    setSelectedCreature(selectedCreature === creatureId ? null : creatureId);
  };

  const renderMarineCreature = (creature: MarineLife) => {
    const style = {
      position: 'absolute' as const,
      left: `${creature.x}%`,
      top: `${creature.y}%`,
      transform: `scale(${creature.size}) ${creature.type !== 'coral' ? `rotate(${creature.direction}deg)` : ''}`,
      transition: isAnimating ? 'all 0.2s ease-out' : 'none',
      cursor: 'pointer',
      zIndex: selectedCreature === creature.id ? 20 : 10
    };

    const healthColor = getHealthColor(creature.health);
    const isSelected = selectedCreature === creature.id;

    const creatureElement = (() => {
      switch (creature.type) {
        case 'fish':
          return (
            <div 
              className={`relative ${isSelected ? 'animate-pulse' : ''}`}
              onClick={() => handleCreatureClick(creature.id)}
            >
              <Fish className={`w-6 h-6 ${healthColor} drop-shadow-lg hover:scale-110 transition-transform`} />
              {isSelected && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Fish - Health: {Math.round(creature.health)}%
                </div>
              )}
            </div>
          );
        case 'turtle':
          return (
            <div 
              className={`relative ${isSelected ? 'animate-bounce' : ''}`}
              onClick={() => handleCreatureClick(creature.id)}
            >
              <div className={`w-8 h-6 ${healthColor.replace('text-', 'bg-')} rounded-full opacity-90 shadow-lg hover:scale-110 transition-transform`}>
                <div className="w-3 h-2 bg-green-600 rounded-full mx-auto mt-1"></div>
              </div>
              {isSelected && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Turtle - Health: {Math.round(creature.health)}%
                </div>
              )}
            </div>
          );
        case 'coral':
          return (
            <div 
              className={`relative ${isSelected ? 'animate-pulse' : ''}`}
              onClick={() => handleCreatureClick(creature.id)}
            >
              <Star className={`w-8 h-8 ${healthColor} drop-shadow-lg hover:scale-110 transition-transform`} />
              {isSelected && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Coral - Health: {Math.round(creature.health)}%
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    })();

    return (
      <div key={creature.id} style={style}>
        {creatureElement}
      </div>
    );
  };

  const getWaterBackground = () => {
    const clarity = waterClarity / 100;
    const baseColor = isDayMode ? 'from-blue-300' : 'from-blue-900';
    const midColor = isDayMode ? 'via-blue-500' : 'via-blue-700';
    const endColor = isDayMode ? 'to-blue-800' : 'to-blue-900';
    
    return `bg-gradient-to-b ${baseColor} ${midColor} ${endColor}`;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Virtual Marine Sanctuary</h2>
              <p className="text-blue-700">Click on marine life to learn more • Your ecosystem reflects your conservation choices</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
                  isAnimating ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                <Waves className="w-5 h-5" />
                <span className="font-medium">{isAnimating ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => setIsDayMode(!isDayMode)}
                className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isDayMode ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <span className="font-medium">{isDayMode ? 'Night' : 'Day'} Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Impact Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How Your Habits Shape This Ocean</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Plastic use: {userData.plasticUse} bottles/week</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Seafood: {userData.seafoodConsumption} meals/week</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Transport: {userData.transportation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Health Score: {userData.oceanHealthScore}%</span>
            </div>
          </div>
        </div>

        {/* Ecosystem Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Ecosystem Health</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(ecosystemHealth)}%</p>
              </div>
              <Heart className="w-10 h-10 text-green-500" />
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${ecosystemHealth}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Waste Level</p>
                <p className="text-2xl font-bold text-red-600">{Math.round(wasteLevel)}%</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${wasteLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Ocean Temperature</p>
                <p className="text-2xl font-bold text-blue-600">{temperature}°C</p>
              </div>
              <Thermometer className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Water Clarity</p>
                <p className="text-2xl font-bold text-teal-600">{Math.round(waterClarity)}%</p>
              </div>
              <div className="w-10 h-10 bg-teal-500 rounded-full opacity-80"></div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${waterClarity}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Virtual Ocean Environment */}
        <div className={`${getWaterBackground()} rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden min-h-96 cursor-crosshair`}>
          {/* Day/Night lighting overlay */}
          <div className={`absolute inset-0 ${isDayMode ? 'bg-yellow-200/10' : 'bg-blue-900/30'} transition-all duration-1000`}></div>
          
          {/* Water quality overlay */}
          <div 
            className="absolute inset-0 bg-gray-500 transition-all duration-1000"
            style={{ opacity: (100 - waterClarity) / 200 }}
          ></div>
          
          {/* Animated water effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/5 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + Math.sin(i) * 20}%`,
                    width: `${10 + i * 2}px`,
                    height: `${10 + i * 2}px`,
                    animationDelay: `${i * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Marine Life */}
          <div className="relative z-10 h-80">
            {marineLife.map(renderMarineCreature)}
            
            {/* Floating particles and plankton */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-white/70 rounded-full animate-ping delay-300"></div>
            <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-300 rounded-full animate-bounce delay-700"></div>
            
            {/* Pollution indicators */}
            {wasteLevel > 30 && (
              <div className="absolute bottom-10 right-10 space-x-2">
                {[...Array(Math.floor(wasteLevel / 20))].map((_, i) => (
                  <div key={i} className="inline-block w-3 h-4 bg-gray-600 rounded opacity-70 cursor-pointer hover:opacity-90 transition-opacity"></div>
                ))}
              </div>
            )}
          </div>

          {/* Ocean floor */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-800 to-amber-600 opacity-60"></div>
          
          {/* Marine life counter */}
          <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-sm font-semibold text-gray-800">
              Marine Life: {marineLife.length} species
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-xs text-gray-700">
              Click on marine life to see their health status
            </div>
          </div>
        </div>

        {/* Conservation Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Take Conservation Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => addConservationAction('cleanup')}
              className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Zap className="w-8 h-8 mx-auto mb-3 group-hover:animate-bounce" />
              <span className="block text-lg font-semibold mb-2">Ocean Cleanup</span>
              <span className="text-sm opacity-90">Remove plastic waste and improve water clarity</span>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                +10% Water Clarity
              </div>
            </button>

            <button
              onClick={() => addConservationAction('temperature')}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Thermometer className="w-8 h-8 mx-auto mb-3 group-hover:animate-pulse" />
              <span className="block text-lg font-semibold mb-2">Cool Waters</span>
              <span className="text-sm opacity-90">Reduce ocean temperature and protect coral</span>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                -1°C Temperature
              </div>
            </button>

            <button
              onClick={() => addConservationAction('restore')}
              className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Star className="w-8 h-8 mx-auto mb-3 group-hover:animate-spin" />
              <span className="block text-lg font-semibold mb-2">Restore Coral</span>
              <span className="text-sm opacity-90">Add new coral reef to boost biodiversity</span>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                +1 Coral Colony
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Interactive Guide:</strong> Click on marine life to see their health status. Use the conservation actions above to improve the ecosystem. 
              Toggle day/night mode and pause/play animations to explore different views of your virtual sanctuary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualSanctuary;