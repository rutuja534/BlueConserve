import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Star, TrendingUp, Lightbulb, Award, Bell, BellOff, Fish } from 'lucide-react';

interface UserData {
  plasticUse: number;
  seafoodConsumption: number;
  transportation: string;
  waterUsage: number;
  oceanHealthScore: number;
}

interface EcoTipsProps {
  userData: UserData;
  completedTips: string[];
  setCompletedTips: (tips: string[]) => void;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: 'plastic' | 'seafood' | 'transport' | 'water' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
}

const EcoTips: React.FC<EcoTipsProps> = ({ userData, completedTips, setCompletedTips }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [streakCount, setStreakCount] = useState(3);
  const [badges, setBadges] = useState<string[]>(['first_step', 'ocean_aware']);

  const allTips: Tip[] = [
    // Plastic tips
    {
      id: 'plastic_bottle',
      title: 'Switch to Reusable Water Bottles',
      description: 'Replace single-use plastic bottles with a reusable alternative',
      impact: 'Save 1,460 plastic bottles yearly, protecting marine life from plastic ingestion',
      category: 'plastic',
      difficulty: 'easy',
      priority: userData.plasticUse > 10 ? 1 : 3
    },
    {
      id: 'plastic_bags',
      title: 'Use Reusable Shopping Bags',
      description: 'Bring your own bags when shopping to avoid plastic bags',
      impact: 'Prevent 300+ plastic bags from entering waterways annually',
      category: 'plastic',
      difficulty: 'easy',
      priority: userData.plasticUse > 5 ? 2 : 4
    },
    {
      id: 'plastic_straws',
      title: 'Say No to Plastic Straws',
      description: 'Use metal, bamboo, or paper straws instead of plastic ones',
      impact: 'Reduce ocean plastic pollution and protect sea turtles',
      category: 'plastic',
      difficulty: 'easy',
      priority: 3
    },

    // Seafood tips
    {
      id: 'sustainable_seafood',
      title: 'Choose Sustainable Seafood',
      description: 'Select certified sustainable fish and avoid overfished species',
      impact: 'Help maintain healthy fish populations and marine ecosystems',
      category: 'seafood',
      difficulty: 'medium',
      priority: userData.seafoodConsumption > 5 ? 1 : 4
    },
    {
      id: 'reduce_seafood',
      title: 'Try Meatless Ocean Days',
      description: 'Reduce seafood consumption by 2 meals per week',
      impact: 'Lower fishing pressure and give marine populations time to recover',
      category: 'seafood',
      difficulty: 'medium',
      priority: userData.seafoodConsumption > 7 ? 1 : 3
    },
    {
      id: 'local_seafood',
      title: 'Buy Local, Fresh Seafood',
      description: 'Purchase from local fishermen to reduce transportation emissions',
      impact: 'Support sustainable fishing practices and reduce carbon footprint',
      category: 'seafood',
      difficulty: 'medium',
      priority: 2
    },

    // Transportation tips
    {
      id: 'public_transport',
      title: 'Use Public Transportation',
      description: 'Take buses, trains, or subways instead of driving',
      impact: 'Reduce CO2 emissions that cause ocean acidification',
      category: 'transport',
      difficulty: 'easy',
      priority: userData.transportation === 'car' ? 1 : 4
    },
    {
      id: 'bike_walk',
      title: 'Walk or Bike Short Distances',
      description: 'Choose active transportation for trips under 3 miles',
      impact: 'Zero emissions transport that helps keep oceans healthy',
      category: 'transport',
      difficulty: 'easy',
      priority: userData.transportation === 'car' ? 2 : 3
    },
    {
      id: 'carbon_offset',
      title: 'Offset Your Carbon Footprint',
      description: 'Invest in marine conservation projects to offset emissions',
      impact: 'Directly fund ocean restoration and conservation efforts',
      category: 'transport',
      difficulty: 'medium',
      priority: userData.transportation === 'flight' ? 1 : 4
    },

    // Water tips
    {
      id: 'shorter_showers',
      title: 'Take Shorter Showers',
      description: 'Reduce shower time to under 5 minutes',
      impact: 'Conserve water and reduce wastewater flowing to oceans',
      category: 'water',
      difficulty: 'easy',
      priority: userData.waterUsage > 15 ? 1 : 3
    },
    {
      id: 'water_efficient',
      title: 'Install Water-Efficient Fixtures',
      description: 'Use low-flow showerheads and faucet aerators',
      impact: 'Reduce water consumption and protect aquatic ecosystems',
      category: 'water',
      difficulty: 'medium',
      priority: userData.waterUsage > 20 ? 2 : 4
    },

    // General tips
    {
      id: 'beach_cleanup',
      title: 'Join Beach Cleanup Events',
      description: 'Participate in local beach or waterway cleanup activities',
      impact: 'Directly remove trash from marine environments',
      category: 'general',
      difficulty: 'easy',
      priority: 2
    },
    {
      id: 'eco_products',
      title: 'Choose Ocean-Safe Products',
      description: 'Use biodegradable soaps and reef-safe sunscreen',
      impact: 'Prevent harmful chemicals from entering marine ecosystems',
      category: 'general',
      difficulty: 'easy',
      priority: 3
    }
  ];

  const getPersonalizedTips = () => {
    return allTips
      .sort((a, b) => a.priority - b.priority)
      .filter(tip => selectedCategory === 'all' || tip.category === selectedCategory)
      .slice(0, selectedCategory === 'all' ? 8 : 6);
  };

  const toggleTipCompletion = (tipId: string) => {
    if (completedTips.includes(tipId)) {
      setCompletedTips(completedTips.filter(id => id !== tipId));
    } else {
      setCompletedTips([...completedTips, tipId]);
      
      // Check for new badges
      const newCompletedCount = completedTips.length + 1;
      if (newCompletedCount === 1 && !badges.includes('first_action')) {
        setBadges([...badges, 'first_action']);
      }
      if (newCompletedCount === 5 && !badges.includes('eco_warrior')) {
        setBadges([...badges, 'eco_warrior']);
      }
      if (newCompletedCount === 10 && !badges.includes('ocean_guardian')) {
        setBadges([...badges, 'ocean_guardian']);
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Tips', color: 'bg-gray-500' },
    { id: 'plastic', label: 'Plastic Reduction', color: 'bg-red-500' },
    { id: 'seafood', label: 'Sustainable Seafood', color: 'bg-blue-500' },
    { id: 'transport', label: 'Transportation', color: 'bg-green-500' },
    { id: 'water', label: 'Water Conservation', color: 'bg-teal-500' },
    { id: 'general', label: 'General Actions', color: 'bg-purple-500' }
  ];

  const badgeInfo = {
    first_step: { name: 'First Step', icon: Star, color: 'text-yellow-500' },
    ocean_aware: { name: 'Ocean Aware', icon: Fish, color: 'text-blue-500' },
    first_action: { name: 'First Action', icon: CheckCircle, color: 'text-green-500' },
    eco_warrior: { name: 'Eco Warrior', icon: Award, color: 'text-purple-500' },
    ocean_guardian: { name: 'Ocean Guardian', icon: TrendingUp, color: 'text-teal-500' }
  };

  const oceanFacts = [
    "Every minute, 1 million plastic bottles are purchased worldwide.",
    "Ocean temperatures have risen by 0.6°C since 1969.",
    "Over 100,000 marine animals die from plastic pollution annually.",
    "The ocean produces over 50% of the world's oxygen.",
    "Coral reefs support 25% of all marine species despite covering less than 1% of the ocean floor."
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % oceanFacts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Lightbulb className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800">Your Personalized Eco-Tips</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your Ocean Health Score of {userData.oceanHealthScore}%, here are tailored actions to protect marine life
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed Tips</p>
                <p className="text-3xl font-bold">{completedTips.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Ocean Health</p>
                <p className="text-3xl font-bold">{userData.oceanHealthScore}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Day Streak</p>
                <p className="text-3xl font-bold">{streakCount}</p>
              </div>
              <Star className="w-10 h-10 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100">Badges Earned</p>
                <p className="text-3xl font-bold">{badges.length}</p>
              </div>
              <Award className="w-10 h-10 text-teal-200" />
            </div>
          </div>
        </div>

        {/* Ocean Fact */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <Fish className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Ocean Fact</h3>
          </div>
          <p className="text-lg opacity-90 transition-all duration-500">
            {oceanFacts[currentFact]}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 border-2 border-blue-300 text-blue-700'
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="font-medium text-sm">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map(badgeId => {
                  const badge = badgeInfo[badgeId as keyof typeof badgeInfo];
                  const IconComponent = badge.icon;
                  return (
                    <div key={badgeId} className="text-center p-3 bg-gray-50 rounded-lg">
                      <IconComponent className={`w-8 h-8 mx-auto mb-2 ${badge.color}`} />
                      <p className="text-xs font-medium text-gray-700">{badge.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Reminders</h3>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  notificationsEnabled
                    ? 'bg-green-50 border border-green-300 text-green-700'
                    : 'bg-gray-50 border border-gray-300 text-gray-600'
                }`}
              >
                <span className="font-medium">Eco Pings</span>
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5" />
                ) : (
                  <BellOff className="w-5 h-5" />
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Get daily reminders to take ocean-friendly actions
              </p>
            </div>
          </div>

          {/* Tips Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getPersonalizedTips().map(tip => {
                const isCompleted = completedTips.includes(tip.id);
                const difficultyColors = {
                  easy: 'bg-green-100 text-green-800',
                  medium: 'bg-yellow-100 text-yellow-800',
                  hard: 'bg-red-100 text-red-800'
                };

                return (
                  <div
                    key={tip.id}
                    className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                      isCompleted
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <button
                        onClick={() => toggleTipCompletion(tip.id)}
                        className="flex-shrink-0 mr-3 mt-1"
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`text-lg font-semibold mb-2 ${
                          isCompleted ? 'text-green-700 line-through' : 'text-gray-800'
                        }`}>
                          {tip.title}
                        </h4>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          difficultyColors[tip.difficulty]
                        }`}>
                          {tip.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {tip.description}
                    </p>

                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">
                        <strong>Impact:</strong> {tip.impact}
                      </p>
                    </div>

                    {tip.priority === 1 && (
                      <div className="mt-3 flex items-center space-x-2 text-orange-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">High Priority</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Motivational Quote */}
            <div className="mt-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-semibold mb-3">Stay Motivated</h3>
              <p className="text-lg opacity-90 italic">
                "The ocean is the planet's life support system. Every action you take to protect it matters."
              </p>
              <p className="text-sm opacity-75 mt-2">- Ocean Conservation Alliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoTips;