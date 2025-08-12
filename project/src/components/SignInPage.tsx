import React, { useState } from 'react';
import { Sparkles, Leaf } from 'lucide-react';

interface SignInPageProps {
  onGoogleSignIn: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onGoogleSignIn }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Sparkles */}
        <div className="absolute top-10 left-4 sm:left-10 animate-pulse">
          <Sparkles className="w-6 h-6 text-emerald-300 opacity-60" />
        </div>
        <div className="absolute top-32 right-4 sm:right-20 animate-pulse delay-1000">
          <Sparkles className="w-4 h-4 text-green-300 opacity-40" />
        </div>
        <div className="absolute bottom-20 left-4 sm:left-16 animate-pulse delay-2000">
          <Sparkles className="w-5 h-5 text-teal-300 opacity-50" />
        </div>
        <div className="absolute top-1/2 right-4 sm:right-10 animate-pulse delay-500">
          <Leaf className="w-8 h-8 text-green-400 opacity-30 transform rotate-45" />
        </div>
        <div className="absolute bottom-32 right-8 sm:right-32 animate-pulse delay-1500">
          <Leaf className="w-6 h-6 text-emerald-400 opacity-40 transform -rotate-12" />
        </div>
        
        {/* Glowing Fireflies */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-300 rounded-full opacity-80 animate-ping delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-70 animate-ping delay-2000"></div>
        
        {/* Fairy Silhouettes */}
        <div className="absolute top-20 right-1/4 opacity-20 animate-float hidden sm:block">
          <div className="text-emerald-300 text-2xl">🧚‍♀️</div>
        </div>
        <div className="absolute bottom-40 left-1/3 opacity-15 animate-float delay-1000 hidden sm:block">
          <div className="text-green-300 text-xl">🧚‍♂️</div>
        </div>
      </div>

      {/* Enhanced Floating Vine Pattern */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            d="M50,400 Q200,200 400,350 T800,300 Q1000,250 1150,400" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            className="text-emerald-300 animate-pulse"
            filter="url(#glow)"
          />
          <path 
            d="M0,600 Q150,400 300,550 T600,500 Q800,450 1200,600" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            className="text-green-400 animate-pulse delay-1000"
            filter="url(#glow)"
          />
          <path 
            d="M100,100 Q300,50 500,150 T900,100 Q1100,80 1200,200" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" 
            className="text-teal-300 animate-pulse delay-2000"
            filter="url(#glow)"
          />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          {/* Enhanced Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4 font-serif animate-fade-in">
              Enter the
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 font-serif animate-fade-in delay-500">
              Fairy Realm
            </h2>
            <p className="text-emerald-200 mt-4 text-base sm:text-lg opacity-80 animate-fade-in delay-1000 px-4">
              Where productivity meets magic ✨
            </p>
          </div>

          {/* Sign In Container */}
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-300/20 animate-slide-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🧚‍♀️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Welcome to the Fairy Realm
              </h3>
              <p className="text-emerald-200 text-sm sm:text-base">
                Sign in with Google to begin your magical journey
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={onGoogleSignIn}
              className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-200 hover:shadow-emerald-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            </button>

            <div className="mt-6 text-center">
              <p className="text-emerald-200/70 text-xs sm:text-sm px-4">
                Join thousands of magical beings organizing their lives with fairy-powered productivity ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
