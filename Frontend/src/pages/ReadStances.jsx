import { React, useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import './ReadStances.css'
import { useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const ReadStances = () => {
  const [stances, setStances] = useState([])
  // State for parties
  const [parties, setParties] = useState([])
  // State for questions/issues
  const [questions, setQuestions] = useState([])

  // State for loading and error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Track which question is currently expanded (by IssueID or index)
  const [expandedQuestionId, setExpandedQuestionId] = useState(null)

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stancesRes, partiesRes, questionsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/stances`),
          fetch(`${import.meta.env.VITE_API_URL}/parties`),
          fetch(`${import.meta.env.VITE_API_URL}/questions`)
        ])

        if (!stancesRes.ok || !partiesRes.ok || !questionsRes.ok) {
          throw new Error('One or more requests failed')
        }

        const [stancesData, partiesData, questionsData] = await Promise.all([
          stancesRes.json(),
          partiesRes.json(),
          questionsRes.json()
        ])

        setStances(stancesData)
        setParties(partiesData)
        setQuestions(questionsData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Toggle expand/collapse of a question container
  const toggleExpand = (issueId) => {
    setExpandedQuestionId(expandedQuestionId === issueId ? null : issueId)
  }

  // Show loading or error messages before rendering data
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Retrieve user answers passed via navigation state
  const location = useLocation();
  const userAnswers = location.state?.answers || JSON.parse(window.localStorage.getItem('quizAnswers') || '{}');

  // Calculate alignment percentages between user's answers and each party
  const alignmentData = parties.map(party => {
    let alignedCount = 0
    let totalAnswered = 0

    questions.forEach(question => {
      const userAnswer = userAnswers[question.IssueID]
      if (userAnswer === 'agree' || userAnswer === 'disagree') {
        totalAnswered++
        const stance = stances.find(s => s.IssueID === question.IssueID && s.PartyID === party.PartyID)
        if (stance && ((userAnswer === 'agree' && stance.Stand === true) || (userAnswer === 'disagree' && stance.Stand === false))) {
          alignedCount++
        }
      }
    })

    return {
      name: party.ShortName,
      alignment: totalAnswered > 0 ? Math.round((alignedCount / totalAnswered) * 100) : 0
    }
  })

  // Custom tick component for rendering party icons and names on the X axis
  const CustomYAxisTick = ({ x, y, payload, parties }) => {
    const party = parties.find(p => p.ShortName === payload.value)

    return (
      <g transform={`translate(${x},${y + 20})`}>
        {party && (
          <>
            <image
              href={party.Icon}
              x={-19} // half icon width to center horizontally
              y={-28} // move it above the text
              width={35}
              height={35}
            />
            <text
              x={0}
              y={5}
              textAnchor='middle'
              fontSize={12}
              dy='1.2em'
            >
              {party.ShortName}
            </text>
          </>
        )}
      </g>
    )
  }

  return (
     <div className='content'>
        <Header />
      <div id="content-container">
      {Object.keys(userAnswers).length > 0 && (
        <div className='alignment-chart'>
          <h4>Party Alignment with Your Answers (%)</h4>
          <ResponsiveContainer Width={600} height={300}>
            <BarChart
              data={alignmentData}
              layout='horizontal'
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                type='category'
                dataKey='name'
                width={80}
                tick={(props) => <CustomYAxisTick {...props} parties={parties} />}
                interval={0}
              />
              <YAxis
                type='number'
                domain={[0, 100]}
                tickFormatter={(tick) => `${tick}%`}
              />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Bar dataKey='alignment' fill='#4CAF50' barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h1>Stance Breakdown</h1>

      {questions.map(question => {
        // Filter stances for this question
        const stancesForQuestion = stances.filter(s => s.IssueID === question.IssueID)

        return (
          <div
            key={question.IssueID}
            className={`question-container ${expandedQuestionId === question.IssueID ? 'expanded' : ''}`}
          >
            <div className='question-header'>
              <h2>Question {question.IssueID}: {question.Summary}</h2>
              <div className='header-right'>
                {userAnswers[question.IssueID] && (
                  <span
                    className={`user-answer ${
                      userAnswers[question.IssueID] === 'agree'
                        ? 'agree'
                        : userAnswers[question.IssueID] === 'disagree'
                        ? 'disagree'
                        : 'skip'
                    }`}
                  >
                    {userAnswers[question.IssueID].charAt(0).toUpperCase() + userAnswers[question.IssueID].slice(1)}
                  </span>
                )}

                <button
                  className='toggle-button'
                  onClick={() => toggleExpand(question.IssueID)}
                >
                  {expandedQuestionId === question.IssueID ? '▲' : '▼'}
                </button>
              </div>
            </div>

            {expandedQuestionId === question.IssueID && (() => {
              const userAnswer = userAnswers[question.IssueID]
              const matchingParties = parties.filter(party => {
                const stance = stancesForQuestion.find(s => s.PartyID === party.PartyID)
                if (!stance || userAnswer === 'skip') return false
                return (userAnswer === 'agree' && stance.Stand === true) ||
                      (userAnswer === 'disagree' && stance.Stand === false)
              })

              return (
                <>
                  {userAnswer && userAnswer !== 'skip' && (
                    <div className='alignment-info'>
                        {matchingParties.length > 0
                          ? <>
                                Your Stance aligns with the:{" "}
                                {matchingParties.map((party, idx) => (
                                    <>
                                    <strong key={party.ID}>
                                        {party.Name}
                                    </strong>
                                    { idx < matchingParties.length - 1 ? ', ' : ''}
                                    </>
                                ))}
                            </>
                          : ( 'No parties matched your stance on this issue.' )}
                    </div>
                  )}

                  <div className='stances-list'>
                    {parties.map(party => {
                      const stance = stancesForQuestion.find(s => s.PartyID === party.PartyID)
                      return (
                        <div
                          key={party.PartyID}
                          className={`stance-item ${stance ? (stance.Stand ? 'agree' : 'disagree') : ''}`}
                        >
                          <img
                            src={party.Icon}
                            alt={party.ShortName}
                            className='party-icon'
                          />
                          <div className='party-info'>
                            <strong>{party.Name}</strong> — Stance: {stance ? (stance.Stand ? 'Agree' : 'Disagree') : 'N/A'}
                            <p>Reason: {stance ? stance.Reason : 'No reason provided'}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default ReadStances
