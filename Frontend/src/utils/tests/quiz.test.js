export function calculateAlignmentData (
  userAnswers,
  questions,
  stances,
  parties
) {
  return parties.map((party) => {
    let alignedCount = 0
    let totalAnswered = 0

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.IssueID]
      if (userAnswer === 'agree' || userAnswer === 'disagree') {
        totalAnswered++
        const stance = stances.find(
          (s) =>
            s.IssueID === question.IssueID &&
                        s.PartyID === party.PartyID
        )
        if (
          stance &&
                    ((userAnswer === 'agree' && stance.Stand === true) ||
                        (userAnswer === 'disagree' && stance.Stand === false))
        ) {
          alignedCount++
        }
      }
    })

    return {
      name: party.ShortName,
      alignment:
                totalAnswered > 0
                  ? Math.round((alignedCount / totalAnswered) * 100)
                  : 0
    }
  })
}

describe('calculateAlignmentData', () => {
  const questions = [
    {
      IssueID: 1,
      Description: "Change national anthem to hip's don't lie",
      Summary: 'On the anthem'
    }
  ]

  const stances = [
    {
      StanceID: 1,
      Stand: true,
      Reason: "It's a certified bop",
      IssueID: 1,
      PartyID: 1
    },
    {
      StanceID: 2,
      Stand: true,
      Reason: 'The current one is good enough TBH',
      IssueID: 1,
      PartyID: 2
    }
  ]

  const parties = [
    {
      PartyID: 1,
      Name: 'Coalition for Shakira',
      ShortName: 'CFS',
      Icon: 'https://example.com/icon1'
    },
    {
      PartyID: 2,
      Name: "Traditionalists' Party",
      ShortName: 'TP',
      Icon: 'https://example.com/icon2'
    }
  ]

  test('user agrees with the anthem change', () => {
    const userAnswers = { 1: 'agree' }
    const result = calculateAlignmentData(
      userAnswers,
      questions,
      stances,
      parties
    )
    expect(result).toEqual([
      { name: 'CFS', alignment: 100 },
      { name: 'TP', alignment: 100 }
    ])
  })

  test('user disagrees with the anthem change', () => {
    const userAnswers = { 1: 'disagree' }
    const result = calculateAlignmentData(
      userAnswers,
      questions,
      stances,
      parties
    )
    expect(result).toEqual([
      { name: 'CFS', alignment: 0 },
      { name: 'TP', alignment: 0 }
    ])
  })

  test('user skips the question', () => {
    const userAnswers = { 1: 'skip' }
    const result = calculateAlignmentData(
      userAnswers,
      questions,
      stances,
      parties
    )
    expect(result).toEqual([
      { name: 'CFS', alignment: 0 },
      { name: 'TP', alignment: 0 }
    ])
  })

  test('user provides no answers', () => {
    const userAnswers = {}
    const result = calculateAlignmentData(
      userAnswers,
      questions,
      stances,
      parties
    )
    expect(result).toEqual([
      { name: 'CFS', alignment: 0 },
      { name: 'TP', alignment: 0 }
    ])
  })
})
