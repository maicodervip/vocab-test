import { useState, useEffect, Suspense, lazy } from 'react';
import { VocabUnit } from './types';
import { auth } from './config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import './index.css';

// Lazy load components
const LoginPage = lazy(() => import('./components/LoginPage'));
const HomePage = lazy(() => import('./components/HomePage'));
const QuizPage = lazy(() => import('./components/QuizPage'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<VocabUnit | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedUnit(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '20px'
      }}>
        Đang tải...
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '20px'
      }}>
        Đang tải...
      </div>
    }>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : selectedUnit ? (
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
    </Suspense>
  );
}

export default App;
