import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function AlignmentChart({
    parties,
    questions,
    userAnswers,
    stances,
}) {
    // Calculate alignment percentages between user's answers and each party
    const iconLookup = {};
    const alignmentData = parties.map((party) => {
        let alignedWeight = 0;
        let totalWeight = 0;

        for (const question of questions) {
            const userResponse = userAnswers[question.IssueID];
            if (!userResponse) continue;

            const { answer, weightage } = userResponse;

            if (answer === "agree" || answer === "disagree") {
                totalWeight += weightage;

                const stance = stances.find(
                    (s) =>
                        s.IssueID === question.IssueID &&
                        s.PartyID === party.PartyID,
                );

                const isAligned =
                    stance &&
                    ((answer === "agree" && stance.Stand === true) ||
                        (answer === "disagree" && stance.Stand === false));

                if (isAligned) {
                    alignedWeight += weightage;
                }
            }
        }

        iconLookup[party.ShortName] = party.Icon;

        return {
            name: party.ShortName,
            Alignment:
                totalWeight > 0
                    ? Math.round((alignedWeight / totalWeight) * 100)
                    : 0,
        };
    });

    // Custom tick component for rendering party icons and names on the X axis
    const CustomYAxisTick = ({ x, y, payload }) => {
        const icon = iconLookup[payload.value];
        return (
            <g transform={`translate(${x},${y + 19})`}>
                {icon && (
                    <>
                        <image
                            href={icon}
                            x={-20} // half icon width to center horizontally
                            y={-25} // move it above the text
                            width={34}
                            height={34}
                            preserveAspectRatio="xMidYMid slice"
                        />
                        <text
                            x={-1}
                            y={22}
                            textAnchor="middle"
                            fontSize={11}
                            dy="0.2em"
                        >
                            {payload.value}
                        </text>
                    </>
                )}
            </g>
        );
    };

    if (Object.keys(userAnswers).length > 0) {
        return (
            <div className="alignment-chart">
                <h4>Party Alignment with Your Answers (%)</h4>
                <ResponsiveContainer height={300} minWidth={300}>
                    <BarChart
                        data={alignmentData}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="category"
                            dataKey="name"
                            tick={(props) => <CustomYAxisTick {...props} />}
                            interval={0}
                        />
                        <YAxis
                            type="number"
                            domain={[0, 100]}
                            tickFormatter={(tick) => `${tick}%`}
                        />
                        <Tooltip
                            formatter={(value) => `${value.toFixed(1)}%`}
                        />
                        <Bar
                            dataKey="Alignment"
                            fill="#4CAF50"
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
