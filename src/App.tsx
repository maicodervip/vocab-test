import { useState } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import { VocabUnit } from './types';
import './index.css';

function App() {
  const [selectedUnit, setSelectedUnit] = useState<VocabUnit | null>(null);

  return (
    <>
      {selectedUnit ? (
        <QuizPage 
          unit={selectedUnit} 
          onBack={() => setSelectedUnit(null)} 
        />
      ) : (
        <HomePage onStartQuiz={setSelectedUnit} />
      )}
    </>
  );
}

export default App;
