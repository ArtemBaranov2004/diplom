import React, { useState, useEffect } from 'react';

const Exercise = ({ number, onAnswer }) => {
  const [exercise, setExercise] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/exercise/${number}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке задания');
        }
        const data = await response.json();
        setExercise(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [number]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
          answer: answer,
        }),
      });
      const result = await response.json();
      onAnswer(result.isCorrect);
    } catch (err) {
      setError('Ошибка при проверке ответа');
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!exercise) return <div>Задание не найдено</div>;

  return (
    <div className="exercise">
      <h3>Задание {number}</h3>
      <div className="question">{exercise.question}</div>
      {exercise.options && (
        <div className="options">
          {(Array.isArray(exercise.options)
            ? exercise.options
            : JSON.parse(exercise.options)
          ).map((option, index) => (
            <div key={index} className="option">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answer === option}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Введите ваш ответ"
        />
        <button type="submit">Проверить</button>
      </form>
    </div>
  );
};

export default Exercise; 