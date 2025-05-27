import { React, useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import './Quiz.css';
import Header from '../components/Header/Header';

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
          <Header />
          <h3>Summary: {issue.Summary}</h3>
          <p className='issue-description'>{issue.Description}</p>
          <div className="button-group">
            <button className='btn disagree'>Disagree</button>
            <button className='btn skip'>Skip</button>
            <button className='btn agree'>Agree</button>
          </div>
          <footer>
            <button className='back-btn'>back</button>            
            Question: {issue.IssueID} / {issues.length}
            <button className='forward-btn'>forward</button>
          </footer>
       </div>
      ))}
    </div>
  );
};

export default Quiz;