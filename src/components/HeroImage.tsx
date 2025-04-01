
import React from 'react';

const HeroImage = () => {
  return (
    <div className="relative">
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-career-purple/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -right-12 w-72 h-72 bg-career-blue/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      
      <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="bg-career-lightPurple p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-career-purple rounded-full flex items-center justify-center text-white font-medium">AI</div>
              <div className="text-sm font-medium">Career Recommendation</div>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-lg border border-gray-100 hover:border-career-purple/30 transition-colors shadow-sm">
                <h3 className="font-semibold text-career-blue">Data Scientist</h3>
                <p className="text-xs text-gray-500">Match: 94%</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100 hover:border-career-purple/30 transition-colors shadow-sm">
                <h3 className="font-semibold text-career-blue">Machine Learning Engineer</h3>
                <p className="text-xs text-gray-500">Match: 87%</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100 hover:border-career-purple/30 transition-colors shadow-sm">
                <h3 className="font-semibold text-career-blue">Data Analyst</h3>
                <p className="text-xs text-gray-500">Match: 82%</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-career-lightBlue p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-sm">Top Skills</h3>
              <div className="space-y-2">
                <div className="bg-white py-1 px-3 rounded-full text-xs">Python</div>
                <div className="bg-white py-1 px-3 rounded-full text-xs">Data Analysis</div>
                <div className="bg-white py-1 px-3 rounded-full text-xs">Machine Learning</div>
              </div>
            </div>
            
            <div className="flex-1 bg-career-lightPurple p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-sm">Salary Range</h3>
              <div className="text-center">
                <div className="text-xl font-bold text-career-purple">$95k - $140k</div>
                <div className="text-xs text-gray-500">National Average</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
