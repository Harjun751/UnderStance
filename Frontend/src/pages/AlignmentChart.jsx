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
	const alignmentData = parties.map((party) => {
		let alignedCount = 0;
		let totalAnswered = 0;

		questions.forEach((question) => {
			const userAnswer = userAnswers[question.IssueID];
			if (userAnswer === "agree" || userAnswer === "disagree") {
				totalAnswered++;
				const stance = stances.find(
					(s) => s.IssueID === question.IssueID && s.PartyID === party.PartyID,
				);
				if (
					stance &&
					((userAnswer === "agree" && stance.Stand === true) ||
						(userAnswer === "disagree" && stance.Stand === false))
				) {
					alignedCount++;
				}
			}
		});

		return {
			name: party.ShortName,
			alignment:
				totalAnswered > 0
					? Math.round((alignedCount / totalAnswered) * 100)
					: 0,
		};
	});

	// Custom tick component for rendering party icons and names on the X axis
	const CustomYAxisTick = ({ x, y, payload, parties }) => {
		const party = parties.find((p) => p.ShortName === payload.value);

		return (
			<g transform={`translate(${x},${y + 19})`}>
				{party && (
					<>
						<image
							href={party.Icon}
							x={-20} // half icon width to center horizontally
							y={-29} // move it above the text
							width={34}
							height={34}
						/>
						<text x={-1} y={4} textAnchor="middle" fontSize={11} dy="0.2em">
							{party.ShortName}
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
				<ResponsiveContainer Width={600} height={300}>
					<BarChart
						data={alignmentData}
						layout="horizontal"
						margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							type="category"
							dataKey="name"
							width={80}
							tick={(props) => <CustomYAxisTick {...props} parties={parties} />}
							interval={0}
						/>
						<YAxis
							type="number"
							domain={[0, 100]}
							tickFormatter={(tick) => `${tick}%`}
						/>
						<Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
						<Bar dataKey="alignment" fill="#4CAF50" barSize={50} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	} else {
		return <></>;
	}
}
