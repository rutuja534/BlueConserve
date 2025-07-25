import React, { useState, useEffect } from 'react';
import { Fish, Waves, Calculator, TrendingUp, Users, ArrowRight, Star, Heart } from 'lucide-react';

interface HomepageProps {
  setActiveTab: (tab: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ setActiveTab }) => {
  const [animatedFish, setAnimatedFish] = useState<Array<{id: number, x: number, y: number, rotation: number}>>([]);
  const [plasticBottles, setPlasticBottles] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([]);

  useEffect(() => {
    // Initialize animated marine life
    const fish = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 20 + Math.random() * 60,
      rotation: Math.random() * 360
    }));
    setAnimatedFish(fish);

    // Initialize plastic bottles that disappear on scroll
    const bottles = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.6
    }));
    setPlasticBottles(bottles);

    // Animate fish movement
    const fishInterval = setInterval(() => {
      setAnimatedFish(prev => prev.map(fish => ({
        ...fish,
        x: (fish.x + 0.5) % 100,
        y: fish.y + Math.sin(Date.now() / 1000 + fish.id) * 0.3,
        rotation: fish.rotation + 0.5
      })));
    }, 100);

    // Handle scroll to fade plastic bottles
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      const opacity = Math.max(0, 0.6 - (scrollY / maxScroll) * 0.6);
      
      setPlasticBottles(prev => prev.map(bottle => ({
        ...bottle,
        opacity: opacity
      })));
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(fishInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Calculator,
      title: 'Eco Impact Tracker',
      description: 'Analyze how your habits affect the ocean ecosystem',
      action: () => setActiveTab('calculator'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Fish,
      title: 'Marine Life Simulator',
      description: 'See your choices reflected in a living ecosystem',
      action: () => setActiveTab('sanctuary'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Smart Eco Tips',
      description: 'Get personalized tips to reduce your footprint',
      action: () => setActiveTab('tips'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        {/* Animated underwater background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-teal-400/20 animate-pulse"></div>
          
          {/* Animated fish */}
          {animatedFish.map(fish => (
            <div
              key={fish.id}
              className="absolute transition-all duration-100 ease-linear"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                transform: `rotate(${fish.rotation}deg)`
              }}
            >
              <Fish className="w-6 h-6 text-yellow-300/70 animate-pulse" />
            </div>
          ))}

          {/* Plastic bottles that fade on scroll */}
          {plasticBottles.map(bottle => (
            <div
              key={bottle.id}
              className="absolute w-4 h-6 bg-gray-400 rounded-t-lg transition-opacity duration-500"
              style={{
                left: `${bottle.x}%`,
                top: `${bottle.y}%`,
                opacity: bottle.opacity
              }}
            >
              <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto -mt-1"></div>
            </div>
          ))}

          {/* Ocean waves effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 opacity-50 animate-pulse"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-bounce">
              <Waves className="w-16 h-16 text-teal-300 mx-auto mb-4" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              BlueConserve
              <span className="block text-3xl md:text-4xl text-teal-300 mt-2">
                Your Virtual Marine Sanctuary
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Track. Simulate. Transform.
            </p>
            
            <button
              onClick={() => setActiveTab('calculator')}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 mx-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-12 text-blue-300">
              <p className="text-sm animate-pulse">↓ Scroll to clean up the ocean ↓</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Transform Your Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how your daily choices affect marine life and learn to make a positive difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-blue-200/50"
                  onClick={feature.action}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <button className="text-blue-600 font-semibold flex items-center space-x-2 group-hover:text-blue-700 transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Join the Movement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-300 mb-2">12,345</div>
              <div className="text-blue-200">Ocean Guardians</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-300 mb-2">2.8M</div>
              <div className="text-blue-200">Plastic Bottles Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-300 mb-2">89%</div>
              <div className="text-blue-200">Ecosystem Recovery</div>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => setActiveTab('community')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Take the Pledge
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <Heart className="w-8 h-8 text-red-500 animate-pulse" />
            <Star className="w-8 h-8 text-yellow-500 animate-pulse delay-100" />
            <Fish className="w-8 h-8 text-blue-500 animate-pulse delay-200" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Make Waves?
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Start your journey to becoming an ocean guardian today
          </p>
          
          <button
            onClick={() => setActiveTab('calculator')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Calculate Your Impact
          </button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;