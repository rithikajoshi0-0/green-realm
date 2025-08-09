import React from 'react';
import { Sparkles, Leaf } from 'lucide-react';

interface SignInPageProps {
  onSignIn: (provider: string) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-pulse">
          <Sparkles className="w-6 h-6 text-emerald-300 opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-pulse delay-1000">
          <Sparkles className="w-4 h-4 text-green-300 opacity-40" />
        </div>
        <div className="absolute bottom-20 left-16 animate-pulse delay-2000">
          <Sparkles className="w-5 h-5 text-teal-300 opacity-50" />
        </div>
        <div className="absolute top-1/2 right-10 animate-pulse delay-500">
          <Leaf className="w-8 h-8 text-green-400 opacity-30 transform rotate-45" />
        </div>
        <div className="absolute bottom-32 right-32 animate-pulse delay-1500">
          <Leaf className="w-6 h-6 text-emerald-400 opacity-40 transform -rotate-12" />
        </div>
      </div>

      {/* Floating Vine Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800">
          <path 
            d="M50,400 Q200,200 400,350 T800,300 Q1000,250 1150,400" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            className="text-emerald-300 animate-pulse"
          />
          <path 
            d="M0,600 Q150,400 300,550 T600,500 Q800,450 1200,600" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            className="text-green-400 animate-pulse delay-1000"
          />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4 font-serif animate-fade-in">
              Enter the
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 font-serif animate-fade-in delay-500">
              Fairy Realm
            </h2>
            <p className="text-emerald-200 mt-4 text-lg opacity-80 animate-fade-in delay-1000">
              Where productivity meets magic ✨
            </p>
          </div>

          {/* Sign In Container */}
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-emerald-300/20 animate-slide-up">
            <div className="space-y-4">
              {/* Google Sign In */}
              <button
                onClick={() => onSignIn('google')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-emerald-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl">🌺</span>
                  <span>Continue with Google</span>
                </div>
              </button>

              {/* Apple Sign In */}
              <button
                onClick={() => onSignIn('apple')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-green-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl">🍃</span>
                  <span>Continue with Apple</span>
                </div>
              </button>

              {/* GitHub Sign In */}
              <button
                onClick={() => onSignIn('github')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-teal-700 to-green-700 hover:from-teal-600 hover:to-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-teal-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl">🌿</span>
                  <span>Continue with GitHub</span>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-emerald-200/70 text-sm">
                Join thousands of magical beings organizing their lives ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;