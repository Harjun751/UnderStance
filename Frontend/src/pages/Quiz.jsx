import { React, useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';

const Quiz = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/questions')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => setIssues(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className='content'>Error: {error}</div>;
  if (!issues.length) return <div>Loading...</div>;
  
  return (
    <div className="quiz">
      <Navbar />
      
      {issues.map(issue => (
        <div className='content' key={issue.IssueID}>
          <h1>Quiz</h1>
          <h2>Question: {issue.IssueID} / {issues.length}</h2>
          <h3>Summary: {issue.Summary}</h3>
          <p>{issue.Description}</p>
          <footer>Testing</footer>
       </div>
      ))}
    </div>
  );
};

export default Quiz;