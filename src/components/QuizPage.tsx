import { useState } from 'react';
import { VocabUnit, VocabItem, QuizMode } from '../types';
import { shuffleArray } from '../utils';
import { ArrowLeft, Check, X, RotateCcw, Trophy, Zap } from 'lucide-react';
import './QuizPage.css';

interface QuizPageProps {
  unit: VocabUnit;
  onBack: () => void;
}

export default function QuizPage({ unit, onBack }: QuizPageProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<VocabItem[]>([]);

  // Get language info based on unit language
  const getLanguageInfo = () => {
    switch (unit.language) {
      case 'japanese':
        return { flag: '🇯🇵', name: 'Tiếng Nhật', shortName: '日本語' };
      case 'chinese':
        return { flag: '🇨🇳', name: 'Tiếng Trung', shortName: '中文' };
      case 'english':
        return { flag: '🇬🇧', name: 'Tiếng Anh', shortName: 'English' };
    }
  };

  const langInfo = getLanguageInfo();

  const startQuiz = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setQuestions(shuffleArray(unit.items));
    setCurrentIndex(0);
    setScore(0);
    setAnswer('');
    setIsCorrect(null);
    setShowResult(false);
    setWrongAnswers([]);
  };

  const currentQuestion = questions[currentIndex];
  
  const getQuestion = () => {
    if (!currentQuestion) return '';
    if (mode === 'foreign-to-vn') {
      // Return foreign language text
      return currentQuestion.japanese || currentQuestion.chinese || currentQuestion.english || '';
    } else {
      // Return Vietnamese
      return currentQuestion.vietnamese;
    }
  };

  const getCorrectAnswer = () => {
    if (!currentQuestion) return '';
    if (mode === 'foreign-to-vn') {
      // Return Vietnamese
      return currentQuestion.vietnamese;
    } else {
      // Return foreign language text
      return currentQuestion.japanese || currentQuestion.chinese || currentQuestion.english || '';
    }
  };

  const normalizeText = (text: string) => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const checkAnswer = () => {
    const userAnswer = normalizeText(answer);
    const correctAnswer = normalizeText(getCorrectAnswer());
    
    // Kiểm tra đáp án chính
    let correct = userAnswer === correctAnswer;
    
    // Nếu có đáp án thay thế (chỉ cho tiếng Nhật), kiểm tra thêm
    if (!correct && currentQuestion.japaneseAlt && mode === 'vn-to-foreign' && unit.language === 'japanese') {
      const altAnswer = normalizeText(currentQuestion.japaneseAlt);
      correct = userAnswer === altAnswer;
    }
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, currentQuestion]);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswer('');
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.trim() && isCorrect === null) {
      checkAnswer();
    }
  };

  const retry = () => {
    if (mode) {
      startQuiz(mode);
    }
  };

  const retryWrong = () => {
    if (mode && wrongAnswers.length > 0) {
      setQuestions(shuffleArray(wrongAnswers));
      setCurrentIndex(0);
      setScore(0);
      setAnswer('');
      setIsCorrect(null);
      setShowResult(false);
      setWrongAnswers([]);
    }
  };

  if (!mode) {
    return (
      <div className="quiz-page">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="mode-selection">
          <h1 className="unit-title gradient-text">{unit.name}</h1>
          <p className="vocab-info">{unit.items.length} từ vựng</p>

          <div className="mode-cards">
            <div className="mode-card card" onClick={() => startQuiz('foreign-to-vn')}>
              <div className="mode-icon">{langInfo.flag} → 🇻🇳</div>
              <h3>{langInfo.name} → Tiếng Việt</h3>
              <p>Xem từ {langInfo.name}, trả lời tiếng Việt</p>
              <button className="mode-button">Chọn chế độ này</button>
            </div>

            <div className="mode-card card" onClick={() => startQuiz('vn-to-foreign')}>
              <div className="mode-icon">🇻🇳 → {langInfo.flag}</div>
              <h3>Tiếng Việt → {langInfo.name}</h3>
              <p>Xem từ tiếng Việt, trả lời {langInfo.name}</p>
              <button className="mode-button">Chọn chế độ này</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;

    return (
      <div className="quiz-page">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="result-section">
          <div className="result-card card">
            {isPerfect && <Trophy className="trophy-icon" size={80} />}
            
            <h1 className="result-title">
              {isPerfect ? '🎉 Hoàn hảo!' : 'Kết quả'}
            </h1>
            
            <div className="score-display">
              <div className="score-number gradient-text">{score}/{questions.length}</div>
              <div className="percentage">{percentage}%</div>
            </div>

            <div className="result-actions">
              <button className="retry-button" onClick={retry}>
                <RotateCcw size={20} />
                Làm lại
              </button>
              
              {wrongAnswers.length > 0 && (
                <button className="retry-wrong-button" onClick={retryWrong}>
                  <Zap size={20} />
                  Ôn lại câu sai ({wrongAnswers.length})
                </button>
              )}
              
              <button className="change-mode-button" onClick={() => setMode(null)}>
                Đổi chế độ
              </button>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="wrong-answers">
                <h3>Các từ cần ôn lại:</h3>
                <div className="wrong-list">
                  {wrongAnswers.map((item, idx) => (
                    <div key={idx} className="wrong-item">
                      <span className="wrong-question">
                        {mode === 'foreign-to-vn' ? (item.japanese || item.chinese || item.english) : item.vietnamese}
                      </span>
                      <span className="wrong-arrow">→</span>
                      <span className="wrong-answer">
                        {mode === 'foreign-to-vn' ? item.vietnamese : (item.japanese || item.chinese || item.english)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
        
        <div className="progress-info">
          <div className="progress-text">
            Câu {currentIndex + 1}/{questions.length}
          </div>
          <div className="score-text">Điểm: {score}</div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="quiz-content">
        <div className={`quiz-card card ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          <div className="question-section">
            <p className="question-label">
              {mode === 'foreign-to-vn' ? `${langInfo.flag} ${langInfo.name}` : '🇻🇳 Tiếng Việt'}
            </p>
            <h2 className="question-text">{getQuestion()}</h2>
          </div>

          <div className="answer-section">
            <p className="answer-label">
              {mode === 'foreign-to-vn' ? '🇻🇳 Nhập tiếng Việt' : `${langInfo.flag} Nhập ${langInfo.name}`}
            </p>
            <input
              type="text"
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu trả lời..."
              disabled={isCorrect !== null}
              autoFocus
            />

            {isCorrect === false && (
              <div className="correct-answer-display">
                <X className="incorrect-icon" />
                <div>
                  <span>Đáp án đúng: <strong>{getCorrectAnswer()}</strong></span>
                  {currentQuestion.japaneseAlt && mode === 'vn-to-foreign' && unit.language === 'japanese' && (
                    <span className="alt-answer"> hoặc <strong>{currentQuestion.japaneseAlt}</strong></span>
                  )}
                </div>
              </div>
            )}

            {isCorrect === true && (
              <div className="correct-display">
                <Check className="correct-icon" />
                <span>Chính xác!</span>
              </div>
            )}
          </div>

          <button
            className="submit-button"
            onClick={checkAnswer}
            disabled={!answer.trim() || isCorrect !== null}
          >
            {isCorrect === null ? 'Kiểm tra' : isCorrect ? '✓ Đúng' : '✗ Sai'}
          </button>
        </div>
      </div>
    </div>
  );
}
