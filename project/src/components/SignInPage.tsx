import React, { useState } from 'react';
import { Sparkles, Leaf, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface SignInPageProps {
  onSignIn: (provider: string) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onSignIn }) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    appleId: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically validate the form and make API calls
    onSignIn(selectedProvider || 'email');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      username: '',
      appleId: '',
      confirmPassword: ''
    });
    setSelectedProvider(null);
    setShowPassword(false);
  };

  const renderProviderForm = () => {
    if (!selectedProvider) return null;

    const commonInputClass = "w-full px-4 py-3 rounded-xl border border-emerald-300/50 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500";

    switch (selectedProvider) {
      case 'google':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Gmail Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@gmail.com"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your Google password"
                  className={commonInputClass}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className={commonInputClass}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign in with Google
            </button>
          </form>
        );

      case 'apple':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Apple ID</label>
              <input
                type="email"
                value={formData.appleId}
                onChange={(e) => handleInputChange('appleId', e.target.value)}
                placeholder="your.appleid@icloud.com"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your Apple ID password"
                  className={commonInputClass}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className={commonInputClass}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign in with Apple
            </button>
          </form>
        );

      case 'github':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">GitHub Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="your-github-username"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className={commonInputClass}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your GitHub password"
                  className={commonInputClass}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className={commonInputClass}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign in with GitHub
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  if (selectedProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
        {/* Background Elements */}
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
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-emerald-300/20">
              {/* Back Button */}
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 text-emerald-200 hover:text-white transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to options</span>
              </button>

              {/* Provider Header */}
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">
                  {selectedProvider === 'google' && (
                    <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  )}
                  {selectedProvider === 'apple' && (
                    <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                  )}
                  {selectedProvider === 'github' && (
                    <div className="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Sign in with {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}
                </h2>
                <p className="text-emerald-200">
                  Enter your {selectedProvider} credentials to continue
                </p>
              </div>

              {/* Form */}
              {renderProviderForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                onClick={() => setSelectedProvider('google')}
                className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </div>
              </button>

              {/* Apple Sign In */}
              <button
                onClick={() => setSelectedProvider('apple')}
                className="w-full group relative overflow-hidden bg-black hover:bg-gray-900 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </div>
              </button>

              {/* GitHub Sign In */}
              <button
                onClick={() => setSelectedProvider('github')}
                className="w-full group relative overflow-hidden bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
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
