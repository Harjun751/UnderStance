import { React, useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/questions')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => setQuestions(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className='content'>Error: {error}</div>;
  if (!questions.length) return <div>Loading...</div>;
  
  return (
    <div className="quiz">
      <Navbar />
      <div className="content">
        <h1>Quiz(TBC)</h1>
        <p>This is where we implement quiz</p>
        <ul>
          {data.map((item, i) => (
            <li key={q.id}>{q.text}</li>
          ))}
      </ul>
      </div>
    </div>
  );
};

export default Quiz;