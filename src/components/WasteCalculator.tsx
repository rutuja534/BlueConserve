import React, { useState, useEffect } from 'react';
import { Calculator, Turtle, Waves, ArrowRight, AlertTriangle, CheckCircle, TrendingUp, Car, Plane, Bus, Bike } from 'lucide-react';

interface UserData {
  plasticUse: number;
  seafoodConsumption: number;
  transportation: string;
  waterUsage: number;
  oceanHealthScore: number;
}

interface WasteCalculatorProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  setActiveTab: (tab: string) => void;
}

const WasteCalculator: React.FC<WasteCalculatorProps> = ({ userData, setUserData, setActiveTab }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateOceanHealthScore = (data: UserData) => {
    let score = 100;
    
    // Plastic use impact (0-20 bottles per week)
    score -= Math.min(data.plasticUse * 2, 40);
    
    // Seafood consumption impact (0-10 meals per week)
    score -= Math.min(data.seafoodConsumption * 3, 30);
    
    // Transportation impact
    const transportImpact = {
      'walk': 0,
      'bike': 5,
      'public': 10,
      'car': 20,
      'flight': 30
    };
    score -= transportImpact[data.transportation as keyof typeof transportImpact] || 20;
    
    // Water usage impact (5-60 minutes)
    score -= Math.min((data.waterUsage - 5) * 0.5, 20);
    
    return Math.max(0, Math.min(100, score));
  };

  useEffect(() => {
    const newScore = calculateOceanHealthScore(userData);
    
    // Animate score counter
    const startScore = animatedScore;
    const duration = 1500;
    const startTime = Date.now();
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentAnimatedScore = Math.round(startScore + (newScore - startScore) * easeOutQuart);
      setAnimatedScore(currentAnimatedScore);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };
    
    requestAnimationFrame(animateScore);
    
    setUserData({ ...userData, oceanHealthScore: newScore });
  }, [userData.plasticUse, userData.seafoodConsumption, userData.transportation, userData.waterUsage]);

  const questions = [
    {
      title: "Plastic Usage",
      description: "How many plastic bottles do you use per week?",
      icon: AlertTriangle,
      key: 'plasticUse',
      type: 'slider',
      min: 0,
      max: 20,
      unit: 'bottles/week',
      tips: [
        "0-2: Excellent! You're already protecting marine life",
        "3-7: Good start, consider a reusable water bottle",
        "8-15: High impact - switch to reusable alternatives",
        "16+: Critical - plastic pollution severely harms ocean life"
      ]
    },
    {
      title: "Seafood Consumption",
      description: "How many seafood meals do you eat per week?",
      icon: Turtle,
      key: 'seafoodConsumption',
      type: 'slider',
      min: 0,
      max: 10,
      unit: 'meals/week',
      tips: [
        "0-2: Low impact on fish populations",
        "3-5: Moderate - choose sustainable options",
        "6-8: High consumption - consider plant alternatives",
        "9+: Very high impact on marine ecosystems"
      ]
    },
    {
      title: "Transportation",
      description: "What's your primary mode of transportation?",
      icon: TrendingUp,
      key: 'transportation',
      type: 'select',
      options: [
        { value: 'walk', label: 'Walking/Cycling', impact: 'Zero Emissions', icon: Bike, color: 'bg-green-500' },
        { value: 'public', label: 'Public Transport', impact: 'Low Emissions', icon: Bus, color: 'bg-blue-500' },
        { value: 'car', label: 'Personal Car', impact: 'Medium Emissions', icon: Car, color: 'bg-yellow-500' },
        { value: 'flight', label: 'Frequent Flying', impact: 'High Emissions', icon: Plane, color: 'bg-red-500' }
      ]
    },
    {
      title: "Water Usage",
      description: "How long are your daily showers (in minutes)?",
      icon: Waves,
      key: 'waterUsage',
      type: 'slider',
      min: 5,
      max: 30,
      unit: 'minutes',
      tips: [
        "5-8: Excellent water conservation",
        "9-12: Good usage, room for improvement",
        "13-20: High usage - consider shorter showers",
        "21+: Excessive - significantly impacts water systems"
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Ocean Guardian';
    if (score >= 60) return 'Ocean Aware';
    if (score >= 40) return 'Getting Started';
    return 'Needs Improvement';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Amazing! Your lifestyle choices are protecting marine ecosystems.';
    if (score >= 60) return 'Good progress! A few changes could make a big difference.';
    if (score >= 40) return 'You\'re on the right track. Let\'s improve your ocean impact.';
    return 'There\'s significant room for improvement. Every change helps!';
  };

  const handleInputChange = (key: string, value: any) => {
    setIsCalculating(true);
    setUserData({ ...userData, [key]: value });
    
    // Add a small delay to show calculation effect
    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
  };

  const getCurrentTip = (question: any) => {
    if (question.type === 'slider' && question.tips) {
      const value = userData[question.key as keyof UserData] as number;
      const maxValue = question.max;
      const tipIndex = Math.min(Math.floor((value / maxValue) * question.tips.length), question.tips.length - 1);
      return question.tips[tipIndex];
    }
    return null;
  };

  const renderQuestion = (question: any, index: number) => {
    const IconComponent = question.icon;
    const isActive = currentStep === index;
    const isCompleted = true; // All questions are always available
    
    return (
      <div className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}>
        <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
          isActive ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
        }`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-gray-100'
              }`}>
                <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{question.title}</h4>
                <p className="text-gray-600">{question.description}</p>
              </div>
            </div>
            {isCompleted && (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            )}
          </div>

          {question.type === 'slider' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {userData[question.key as keyof UserData]}
                </span>
                <span className="text-gray-500 font-medium">{question.unit}</span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={userData[question.key as keyof UserData]}
                  onChange={(e) => handleInputChange(question.key, parseInt(e.target.value))}
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider hover:bg-blue-300 transition-colors"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((userData[question.key as keyof UserData] as number - question.min) / (question.max - question.min)) * 100}%, #E5E7EB ${((userData[question.key as keyof UserData] as number - question.min) / (question.max - question.min)) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{question.min}</span>
                  <span>{question.max}</span>
                </div>
              </div>

              {getCurrentTip(question) && (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>Impact:</strong> {getCurrentTip(question)}
                  </p>
                </div>
              )}
            </div>
          )}

          {question.type === 'select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option: any) => {
                const OptionIcon = option.icon;
                const isSelected = userData[question.key as keyof UserData] === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange(question.key, option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${option.color} ${
                        isSelected ? 'text-white' : 'text-white'
                      }`}>
                        <OptionIcon className="w-5 h-5" />
                      </div>
                      <div className="font-semibold">{option.label}</div>
                    </div>
                    <div className="text-sm text-gray-600">{option.impact}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Calculator className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Ocean Impact Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how your daily habits affect marine ecosystems and get your personalized Ocean Health Score
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Questions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Assessment Progress</h3>
                <span className="text-sm text-gray-600">{currentStep + 1} of {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-6 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600 transition-colors font-medium"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
                  disabled={currentStep === questions.length - 1}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Current Question */}
            {renderQuestion(questions[currentStep], currentStep)}

            {/* All Questions Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map((question, index) => {
                  const IconComponent = question.icon;
                  const isCompleted = true;
                  const isCurrent = currentStep === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 active:scale-95 ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCompleted ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <IconComponent className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{question.title}</div>
                          <div className="text-sm text-gray-600">
                            {question.type === 'slider' 
                              ? `${userData[question.key as keyof UserData]} ${question.unit}`
                              : userData[question.key as keyof UserData]
                            }
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ocean Health Score */}
          <div className="lg:col-span-1">
            <div className={`bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white sticky top-6 transition-all duration-300 ${
              isCalculating ? 'animate-pulse' : ''
            }`}>
              <div className="text-center">
                <Waves className="w-12 h-12 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold mb-2">Ocean Health Score</h3>
                <div className="mb-6">
                  <div className={`text-6xl font-bold mb-2 transition-all duration-500 ${
                    isCalculating ? 'scale-110' : 'scale-100'
                  }`}>
                    {animatedScore}
                  </div>
                  <div className="text-lg opacity-90">{getScoreLabel(animatedScore)}</div>
                  <div className="text-sm opacity-75 mt-2 leading-relaxed">
                    {getScoreMessage(animatedScore)}
                  </div>
                </div>

                {/* Score visualization */}
                <div className="mb-8">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="white"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${(animatedScore / 100) * 314} 314`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Turtle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm opacity-90 mb-6">
                  <div className="flex justify-between">
                    <span>Plastic Impact</span>
                    <span>-{Math.min(userData.plasticUse * 2, 40)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seafood Impact</span>
                    <span>-{Math.min(userData.seafoodConsumption * 3, 30)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Footprint</span>
                    <span>-{userData.transportation === 'walk' ? '0' : userData.transportation === 'bike' ? '5' : userData.transportation === 'public' ? '10' : userData.transportation === 'car' ? '20' : '30'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Usage</span>
                    <span>-{Math.min((userData.waterUsage - 5) * 0.5, 20).toFixed(0)}%</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('sanctuary')}
                  className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span>See Your Ocean</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-4 text-xs opacity-75">
                  Your virtual marine sanctuary awaits!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteCalculator;