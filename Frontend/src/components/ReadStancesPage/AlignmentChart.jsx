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

    //Find party with the highest alignment
    const highestAlignment = alignmentData.reduce((max, party) =>
        party.Alignment > max.Alignment ? party : max,
        { name: "", Alignment: -1 }
    );

    const highestAlignmentIcon = iconLookup[highestAlignment.name];

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
            <>
                <h1>Party Alignment Breakdown (%)</h1>
                <div className="alignment-chart">
                    <div className="alignment-text">
                        <h3>
                            {highestAlignmentIcon && (
                                <img
                                    src={highestAlignmentIcon}
                                    alt={`${highestAlignment.name} icon`}
                                    width={34}
                                    height={34}
                                />
                            )}
                            <strong>{highestAlignment.name}</strong> best aligns with your stance!
                        </h3>
                        
                    </div>
                    <ResponsiveContainer height={300} minWidth={300}>
                        <BarChart
                            data={alignmentData}
                            layout="horizontal"
                            margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
                        >
                            <CartesianGrid vertical={false} horizontal={true}/>
                            <XAxis
                                type="category"
                                dataKey="name"
                                tick={(props) => <CustomYAxisTick {...props} />}
                                interval={0}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={(tick) => `${tick}%`}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                formatter={(value) => `${value.toFixed(1)}%`}
                                cursor={false}
                            />
                            <Bar
                                dataKey="Alignment"
                                fill="#FFD700"
                                maxBarSize={50}
                                radius={8}
                                label={({ value, x, y, width }) => (
                                    <text
                                    x={x + width / 2}
                                    y={y - 6}
                                    textAnchor="middle"
                                    fill="#000000"
                                    fontSize={12}
                                    >
                                    {value}%
                                    </text>
                                )}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </>
            
        );
    }
}
