import { React, useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import Header from '../components/Header/Header';
import './ReadStances.css'


const ReadStances = () => {

  const [stances, setStances] = useState([]);
  // State for parties
  const [parties, setParties] = useState([]);
  // State for questions/issues
  const [questions, setQuestions] = useState([]);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which question is currently expanded (by IssueID or index)
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stancesRes, partiesRes, questionsRes] = await Promise.all([
          fetch('/stances'),
          fetch('/parties'),
          fetch('/questions')
        ]);

        if (!stancesRes.ok || !partiesRes.ok || !questionsRes.ok) {
          throw new Error('One or more requests failed');
        }

        const [stancesData, partiesData, questionsData] = await Promise.all([
          stancesRes.json(),
          partiesRes.json(),
          questionsRes.json()
        ]);

        setStances(stancesData);
        setParties(partiesData);
        setQuestions(questionsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle expand/collapse of a question container
  const toggleExpand = (issueId) => {
    setExpandedQuestionId(expandedQuestionId === issueId ? null : issueId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="read-stances">
      <Navbar />
      <Header />

      {questions.map(question => {
        // Filter stances for this question
        const stancesForQuestion = stances.filter(s => s.IssueID === question.IssueID);

        return (
          <div
            key={question.IssueID}
            className={`question-container ${expandedQuestionId === question.IssueID ? 'expanded' : ''}`}
            /*onClick={() => toggleExpand(question.IssueID)}*/
          >
            <div className='question-header'>
              <h3>{question.Summary}</h3>
              <button
                className="toggle-button"
                onClick={() => toggleExpand(question.IssueID)}
              >
                {expandedQuestionId === question.IssueID ? '▲' : '▼'}
              </button>
            </div>

            {expandedQuestionId === question.IssueID && (
              <div className="stances-list">
                {parties.map(party => {
                  const stance = stancesForQuestion.find(s => s.PartyID === party.PartyID);
                  return (
                    <div 
                      key={party.PartyID} 
                      className={`stance-item ${stance ? (stance.Stand ? 'agree' : 'disagree') : ''}`}
                    >
                      <img
                        src={party.Icon}
                        alt={party.ShortName}
                        className="party-icon"
                      />
                      <div className="party-info">
                        <strong>{party.Name}</strong> — Stance: {stance ? (stance.Stand ? 'Agree' : 'Disagree') : 'N/A'}
                        <p>Reason: {stance ? stance.Reason : 'No reason provided'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReadStances;