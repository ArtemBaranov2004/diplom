import React, { useState, useEffect } from 'react';
import Exercise from './components/Exercise';
import './App.css';

function App() {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [variant, setVariant] = useState([]);
  const [loadError, setLoadError] = useState(null);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentExercise < variant.length) {
      setCurrentExercise(currentExercise + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentExercise(1);
    setScore(0);
    setShowResult(false);
    setLoadError(null);
    fetchVariant();
  };

  const fetchVariant = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/variant');
      if (!response.ok) throw new Error('Ошибка загрузки варианта');
      const data = await response.json();
      setVariant(data); // variant — массив из 16 вопросов
    } catch (err) {
      setLoadError(err.message);
    }
  };

  useEffect(() => {
    fetchVariant();
    // eslint-disable-next-line
  }, []);

  if (loadError) {
    return (
      <div className="result-screen">
        <h2>Ошибка: {loadError}</h2>
        <button onClick={handleRestart}>Начать заново</button>
      </div>
    );
  }

  if (showResult || currentExercise > variant.length) {
    return (
      <div className="result-screen">
        <h2>Тест завершен!</h2>
        <p>Ваш результат: {score} из {variant.length || 12}</p>
        <button onClick={handleRestart}>Начать заново</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ОГЭ по информатике</h1>
        <p>Задание {currentExercise} из 12</p>
        <p>Правильных ответов: {score}</p>
      </header>
      <main>
        <Exercise number={currentExercise} onAnswer={handleAnswer} />
      </main>
    </div>
  );
}

export default App;
