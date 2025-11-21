import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import LoginPage from './components/LoginPage';
import { VocabUnit } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { getCurrentUsername } from './services/firebaseService';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<VocabUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get username from Firestore
        const username = await getCurrentUsername();
        setCurrentUser(username || user.uid);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUnit(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Đang tải...
      </div>
    );
  }

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
