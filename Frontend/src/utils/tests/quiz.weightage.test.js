/* eslint-env vitest */
describe('some test', () => {
  test('does something', () => {
    expect(true).toBe(true);
  });
});

// const parties = [
//   { partyId: 1, name: "Coalition for Shakira" },
//   { partyId: 2, name: "Traditionalists' Party" },
// ];

// Stances: [IssueID, PartyID, Stand]
const stances = [
  [1, 1, true], [1, 2, false],
  [2, 1, true], [2, 2, false],
  [3, 1, true], [3, 2, false],
  [4, 1, true], [4, 2, false],
  [5, 1, true], [5, 2, true],
  [6, 1, true], [6, 2, false],
  [7, 1, true], [7, 2, false],
  [8, 1, true], [8, 2, false],
  [9, 1, true], [9, 2, false],
  [10, 1, true], [10, 2, false],
];

// Prepare stance lookup by party for quick access
const stancesByParty = {
  1: {},
  2: {},
};

for (const [issueId, partyId, stand] of stances) {
  stancesByParty[partyId][issueId] = stand;
}

// Calculate total weightage per party
function calculateWeightage(userAnswers, partyStances, weightagePerIssue) {
  let total = 0;
  for (const [issueIdStr, userAnswer] of Object.entries(userAnswers)) {
    const issueId = Number(issueIdStr);
    const partyAnswer = partyStances[issueId];
    if (partyAnswer === userAnswer) {
      total += weightagePerIssue[issueId] || 0;
    }
  }
  return total;
}

describe('Weightage calculation with fixed user answers and weightages', () => {
  test('All user answers true, uniform weightage 5 for all questions', () => {
    const userAnswers = {
      1: true, 2: true, 3: true, 4: true, 5: true,
      6: true, 7: true, 8: true, 9: true, 10: true,
    };
    const weightagePerIssue = {
      1: 5, 2: 5, 3: 5, 4: 5, 5: 5,
      6: 5, 7: 5, 8: 5, 9: 5, 10: 5,
    };

    const weightCFS = calculateWeightage(userAnswers, stancesByParty[1], weightagePerIssue);
    const weightTP = calculateWeightage(userAnswers, stancesByParty[2], weightagePerIssue);

    expect(weightCFS).toBe(50); // All true match for CFS, 10*5
    // TP only matches question 5 (true), so weightage 5
    expect(weightTP).toBe(5);
  });

  test('All user answers false, varying weightages', () => {
    const userAnswers = {
      1: false, 2: false, 3: false, 4: false, 5: false,
      6: false, 7: false, 8: false, 9: false, 10: false,
    };
    const weightagePerIssue = {
      1: 3, 2: 2, 3: 4, 4: 1, 5: 7,
      6: 3, 7: 2, 8: 4, 9: 3, 10: 5,
    };

    const weightCFS = calculateWeightage(userAnswers, stancesByParty[1], weightagePerIssue);
    const weightTP = calculateWeightage(userAnswers, stancesByParty[2], weightagePerIssue);

    // CFS stance is mostly true, so no matches for false answers => 0
    expect(weightCFS).toBe(0);

    // TP stance is mostly false except question 5 (true)
    // So matches on questions with false stance:
    // Q1=3, Q2=2, Q3=4, Q4=1, Q6=3, Q7=2, Q8=4, Q9=3, Q10=5
    // sum all except Q5
    const expectedTP = 3+2+4+1+3+2+4+3+5; // = 27
    expect(weightTP).toBe(expectedTP);
  });

  test('Mixed answers with mixed weightages', () => {
    const userAnswers = {
      1: true, 2: false, 3: true, 4: false, 5: true,
      6: true, 7: false, 8: true, 9: false, 10: true,
    };
    const weightagePerIssue = {
      1: 4, 2: 6, 3: 3, 4: 2, 5: 5,
      6: 1, 7: 7, 8: 3, 9: 2, 10: 4,
    };

    const weightCFS = calculateWeightage(userAnswers, stancesByParty[1], weightagePerIssue);
    const weightTP = calculateWeightage(userAnswers, stancesByParty[2], weightagePerIssue);

    // Calculate expected manually:

    // CFS stands: all true except none false for their party stance
    // For each question:
    // Q1: user true, CFS true => 4
    // Q2: user false, CFS true => no
    // Q3: user true, CFS true => 3
    // Q4: user false, CFS true => no
    // Q5: user true, CFS true => 5
    // Q6: user true, CFS true => 1
    // Q7: user false, CFS true => no
    // Q8: user true, CFS true => 3
    // Q9: user false, CFS true => no
    // Q10: user true, CFS true => 4
    // Total = 4 + 3 + 5 + 1 + 3 + 4 = 20

    expect(weightCFS).toBe(20);

    // TP stands: all false except question 5 true
    // For each question:
    // Q1: user true, TP false => no
    // Q2: user false, TP false => 6
    // Q3: user true, TP false => no
    // Q4: user false, TP false => 2
    // Q5: user true, TP true => 5
    // Q6: user true, TP false => no
    // Q7: user false, TP false => 7
    // Q8: user true, TP false => no
    // Q9: user false, TP false => 2
    // Q10: user true, TP false => no
    // Total = 6 + 2 + 5 + 7 + 2 = 22

    expect(weightTP).toBe(22);
  });
});