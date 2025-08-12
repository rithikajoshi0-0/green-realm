import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import SignInPage from './components/SignInPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Error signing in with Google: ' + error.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧚‍♀️</div>
          <p className="text-emerald-600 text-lg">Loading your magical realm...</p>
        </div>
      </div>
    );
  }

  const getUserDisplayInfo = () => {
    if (!user) return null;
    
    return {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Fairy Explorer',
      avatar: '🧚‍♀️',
      email: user.email
    };
  };

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <SignInPage onGoogleSignIn={handleGoogleSignIn} />
      ) : (
        <Dashboard user={getUserDisplayInfo()} onSignOut={handleSignOut} />
      )}
    </div>
  );
}

export default App;
