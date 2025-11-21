import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import LoginPage from './components/LoginPage';
import { VocabUnit } from './types';
import { getCurrentUser } from './services/storage';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<VocabUnit | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      // Clear any old workspace to force showing workspace selector
      localStorage.removeItem('vocab_current_workspace');
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUnit(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {selectedUnit ? (
        <QuizPage 
          unit={selectedUnit} 
          onBack={() => setSelectedUnit(null)} 
        />
      ) : (
        <HomePage 
          onStartQuiz={setSelectedUnit}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;
