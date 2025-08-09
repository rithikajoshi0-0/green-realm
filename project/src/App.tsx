import React, { useState, useEffect } from 'react';
import SignInPage from './components/SignInPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const savedUser = localStorage.getItem('fairyUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignIn = (provider: string) => {
    // Mock authentication
    const mockUser = {
      name: provider === 'google' ? 'Fairy Explorer' : 
            provider === 'apple' ? 'Nature Spirit' : 'Garden Guardian',
      provider,
      avatar: '🧚‍♀️'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('fairyUser', JSON.stringify(mockUser));
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fairyUser');
  };

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <SignInPage onSignIn={handleSignIn} />
      ) : (
        <Dashboard user={user} onSignOut={handleSignOut} />
      )}
    </div>
  );
}

export default App;