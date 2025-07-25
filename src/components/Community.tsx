import React, { useState, useEffect } from 'react';
import { Users, Heart, Share2, Twitter, Facebook, Linkedin, Award, Waves, Fish, Star, TrendingUp } from 'lucide-react';

interface CommunityProps {
  pledgeCount: number;
  setPledgeCount: (count: number) => void;
  userHasPledged: boolean;
  setUserHasPledged: (pledged: boolean) => void;
}

const Community: React.FC<CommunityProps> = ({ 
  pledgeCount, 
  setPledgeCount, 
  userHasPledged, 
  setUserHasPledged 
}) => {
  const [userName, setUserName] = useState('');
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [recentPledgers, setRecentPledgers] = useState<string[]>([
    'Marina', 'Ocean_Lover', 'EcoWarrior', 'BlueGuardian', 'WaveRider',
    'CoralProtector', 'TurtleFriend', 'SeaAdvocate', 'AquaDefender', 'MarineHero'
  ]);
  const [animatedCount, setAnimatedCount] = useState(pledgeCount);

  // Animate pledge counter
  useEffect(() => {
    const startCount = animatedCount;
    const endCount = pledgeCount;
    const duration = 2000;
    const startTime = Date.now();

    const animateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = Math.round(startCount + (endCount - startCount) * easeOutQuart);
      setAnimatedCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    if (startCount !== endCount) {
      requestAnimationFrame(animateCount);
    }
  }, [pledgeCount]);

  const handlePledge = () => {
    if (userName.trim() && !userHasPledged) {
      setUserHasPledged(true);
      setPledgeCount(pledgeCount + 1);
      setRecentPledgers([userName, ...recentPledgers.slice(0, 9)]);
      setShowPledgeForm(false);
      setUserName('');
    }
  };

  const shareText = "I just pledged to protect our oceans with BlueConserve! Join me in making waves for marine conservation. 🌊 #OceanConservation #BlueConserve";
  const shareUrl = window.location.origin;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    }
  ];

  const communityStats = [
    { 
      label: 'Ocean Guardians', 
      value: animatedCount, 
      icon: Users, 
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Plastic Bottles Saved', 
      value: '2.8M', 
      icon: TrendingUp, 
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: 'Species Protected', 
      value: '1,247', 
      icon: Fish, 
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    { 
      label: 'Coral Reefs Restored', 
      value: '89', 
      icon: Star, 
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const impactStories = [
    {
      name: 'Sarah M.',
      location: 'California',
      story: 'Reduced my plastic use by 80% and organized 3 beach cleanups in my community.',
      impact: '500+ bottles saved',
      avatar: '🌊'
    },
    {
      name: 'Alex K.',
      location: 'Florida',
      story: 'Switched to sustainable seafood and helped establish a marine protected area.',
      impact: '12 species protected',
      avatar: '🐢'
    },
    {
      name: 'Emma L.',
      location: 'Oregon',
      story: 'Started a youth ocean conservation club that now has 200+ members.',
      impact: '50 new guardians',
      avatar: '🐋'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Users className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Ocean Guardian Community</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of ocean lovers making a real difference for marine conservation
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`${stat.bg} rounded-xl p-6 text-center border border-gray-200`}>
                <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('600', '100')} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Pledge Section */}
          <div className="lg:col-span-2">
            {/* Pledge Card */}
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <Heart className="w-8 h-8 text-red-300 animate-pulse" />
                  <h2 className="text-3xl font-bold">Take the Ocean Pledge</h2>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 mb-6 backdrop-blur-sm">
                  <p className="text-lg leading-relaxed">
                    "I commit to protecting marine life and ocean ecosystems through conscious choices, 
                    sustainable practices, and inspiring others to join the movement for healthier seas."
                  </p>
                </div>

                {!userHasPledged ? (
                  <div>
                    {!showPledgeForm ? (
                      <button
                        onClick={() => setShowPledgeForm(true)}
                        className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        I Pledge to Protect Our Oceans
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Enter your name (optional)"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500"
                          maxLength={20}
                        />
                        <div className="flex space-x-4">
                          <button
                            onClick={handlePledge}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center space-x-2"
                          >
                            <Heart className="w-5 h-5" />
                            <span>Make Pledge</span>
                          </button>
                          <button
                            onClick={() => setShowPledgeForm(false)}
                            className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-green-500 rounded-xl p-4 mb-4">
                      <Award className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-lg font-semibold">Thank you for your pledge!</p>
                      <p className="opacity-90">You're now an official Ocean Guardian</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-blue-200 text-sm">
                    💙 {animatedCount.toLocaleString()} guardians have pledged so far!
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Pledgers */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Waves className="w-6 h-6 text-blue-600" />
                <span>Recent Ocean Guardians</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {recentPledgers.slice(0, 10).map((name, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate">{name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Stories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Guardian Impact Stories</h3>
              <div className="space-y-6">
                {impactStories.map((story, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50/50 rounded-r-lg">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{story.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-800">{story.name}</h4>
                          <span className="text-sm text-gray-500">• {story.location}</span>
                        </div>
                        <p className="text-gray-600 mb-2">{story.story}</p>
                        <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Impact: {story.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Share Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                <span>Spread the Word</span>
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Share your commitment and inspire others to join the ocean conservation movement.
              </p>
              <div className="space-y-3">
                {shareLinks.map((platform, index) => {
                  const IconComponent = platform.icon;
                  return (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 ${platform.color} text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">Share on {platform.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Pledge Benefits */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Guardian Benefits</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Exclusive conservation updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Early access to new features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Digital guardian certificate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Community recognition</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Together, We Can Save Our Oceans</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Every pledge matters. Every action counts. Join our growing community of ocean guardians 
            and be part of the solution for healthier seas and thriving marine life.
          </p>
          {!userHasPledged && (
            <button
              onClick={() => setShowPledgeForm(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Take the Pledge Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;