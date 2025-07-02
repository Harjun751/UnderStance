import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import { useState } from "react";
import { FaCheck, FaTimes, FaTable } from "react-icons/fa";
import { GoSkip } from "react-icons/go";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { BiSolidCategory } from "react-icons/bi";
import { IoStatsChart } from "react-icons/io5";
import WeightageTuning from "./WeightageTuning";

// (Category Alignment)
const Category_CustomXAxisTick = ({ x, y, payload }) => {
    const words = payload.value.split(" ");
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={10}
                y={10}
                dy={16}
                textAnchor="end"
                transform="rotate(-30)"
                fontSize={11}
                fill="#333"
            >
                {words.map((word, index) => (
                    <tspan key={word} x={0} dy={index === 0 ? 0 : 12}>
                        {word}
                    </tspan>
                ))}
            </text>
        </g>
    );
};

// (Overall Alignment) Custom tick component for rendering party icons and names on the X axis
const CustomYAxisTick = ({ x, y, payload, iconLookup }) => {
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

export default function AlignmentChart({
    parties,
    questions,
    userAnswers,
    stances,
    updateUserAnswers,
}) {
    const [view, setView] = useState("chart"); // chart or table
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
            fill: party.PartyColor,
        };
    });

    //Find party with the highest alignment
    const highestAlignment = alignmentData.reduce(
        (max, party) => (party.Alignment > max.Alignment ? party : max),
        { name: "", Alignment: -1 },
    );

    const highestAlignmentIcon = iconLookup[highestAlignment.name];

    //Find Category Alignment
    const categoryPartyAlignment = {}; // category -> { partyName: { aligned, total } }

    for (const question of questions) {
        const { Category, IssueID } = question;
        const userResponse = userAnswers[IssueID];
        if (!userResponse) continue;

        const { answer, weightage } = userResponse;
        if (answer !== "agree" && answer !== "disagree") continue;

        if (!categoryPartyAlignment[Category]) {
            categoryPartyAlignment[Category] = {};
        }

        for (const party of parties) {
            const stance = stances.find(
                (s) => s.IssueID === IssueID && s.PartyID === party.PartyID,
            );

            const isAligned =
                stance &&
                ((answer === "agree" && stance.Stand === true) ||
                    (answer === "disagree" && stance.Stand === false));

            if (!categoryPartyAlignment[Category][party.ShortName]) {
                categoryPartyAlignment[Category][party.ShortName] = {
                    aligned: 0,
                    total: 0,
                };
            }

            if (isAligned) {
                categoryPartyAlignment[Category][party.ShortName].aligned +=
                    weightage;
            }

            categoryPartyAlignment[Category][party.ShortName].total +=
                weightage;
        }
    }

    // Convert to Recharts-friendly array
    const groupedCategoryData = Object.entries(categoryPartyAlignment).map(
        ([category, partyData]) => {
            const entry = { category };
            for (const [partyName, { aligned, total }] of Object.entries(
                partyData,
            )) {
                entry[partyName] =
                    total > 0 ? Math.round((aligned / total) * 100) : 0;
            }
            return entry;
        },
    );

    /* comparison table */
    const renderTable = () => (
        <>
            <div className="comparison-table-wrapper">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Category</th>
                            <th>Your Answer</th>
                            <th>Importance</th>
                            {parties.map((party) => (
                                <th key={party.PartyID}>{party.ShortName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => {
                            const user = userAnswers[question.IssueID];
                            if (!user) return null;

                            const renderIcon = (val) => {
                                if (val === "agree")
                                    return <FaCheck color="green" />;
                                if (val === "disagree")
                                    return <FaTimes color="red" />;
                                return <GoSkip color="gray" />;
                            };

                            return (
                                <tr key={question.IssueID}>
                                    <td>{question.Description}</td>
                                    <td>{question.Category}</td>
                                    <td>{renderIcon(user.answer)}</td>
                                    <td>{user.weightage}</td>
                                    {parties.map((party) => {
                                        const stance = stances.find(
                                            (s) =>
                                                s.IssueID ===
                                                    question.IssueID &&
                                                s.PartyID === party.PartyID,
                                        );
                                        const stanceIcon =
                                            stance?.Stand === true ? (
                                                <FaCheck color="green" />
                                            ) : stance?.Stand === false ? (
                                                <FaTimes color="red" />
                                            ) : (
                                                <GoSkip color="gray" />
                                            );
                                        return (
                                            <td key={party.PartyID}>
                                                {stanceIcon}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderChart = () => (
        <>
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
                    <br />
                    <strong> {highestAlignment.name} </strong> best aligns with
                    your stance!
                </h3>
            </div>
            <ResponsiveContainer height={300} minWidth={300}>
                <BarChart
                    data={alignmentData}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
                >
                    <CartesianGrid vertical={false} horizontal={true} />
                    <XAxis
                        type="category"
                        dataKey="name"
                        tick={(props) => (
                            <CustomYAxisTick
                                {...props}
                                iconLookup={iconLookup}
                            />
                        )}
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
        </>
    );

    const maxCategoryLength = Math.max(
        groupedCategoryData.map((d) => d.category.length),
    );
    const leftMargin = Math.min(150, maxCategoryLength * 8); // max 150px

    const renderCategory = () => (
        <>
            <div className="alignment-text">
                <strong>Alignment by Category</strong>
            </div>
            <ResponsiveContainer height={300} minWidth={300}>
                <BarChart
                    data={groupedCategoryData}
                    layout="horizontal"
                    margin={{
                        top: 20,
                        right: 30,
                        left: leftMargin,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid vertical={false} horizontal={true} />
                    <YAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                        axisLine={false}
                        tickLine={false}
                    />
                    <XAxis
                        type="category"
                        dataKey="category"
                        tick={<Category_CustomXAxisTick />}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        formatter={(value) => `${value}%`}
                        cursor={false}
                    />
                    {parties.map((party) => (
                        <Bar
                            key={party.ShortName}
                            dataKey={party.ShortName}
                            fill={party.PartyColor}
                            barSize={20}
                            radius={6}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </>
    );

    if (Object.keys(userAnswers).length > 0) {
        return (
            <>
                <h1>Party Alignment Breakdown (%)</h1>
                <div className="alignment-chart">
                    <div
                        className="alignment-toggle-buttons"
                        style={{ marginBottom: "1rem" }}
                    >
                        <button
                            type="button"
                            className={view === "chart" ? "active" : ""}
                            onClick={() => setView("chart")}
                        >
                            <div className="button-icon">
                                <IoStatsChart />
                            </div>
                            <div className="button-text">Result</div>
                        </button>
                        <button
                            type="button"
                            className={view === "category" ? "active" : ""}
                            onClick={() => setView("category")}
                        >
                            <div className="button-icon">
                                <BiSolidCategory />
                            </div>
                            <div className="button-text">Category</div>
                        </button>
                        <button
                            type="button"
                            className={view === "table" ? "active" : ""}
                            onClick={() => setView("table")}
                        >
                            <div className="button-icon">
                                <FaTable />
                            </div>
                            <div className="button-text">Breakdown</div>
                        </button>
                        <button
                            type="button"
                            className={view === "tune" ? "active" : ""}
                            onClick={() => setView("tune")}
                        >
                            <div className="button-icon">
                                <HiAdjustmentsHorizontal /> 
                            </div>
                            <div className="button-text">Tuning</div>
                        </button>
                    </div>
                    {view === "chart"
                        ? renderChart()
                        : view === "category"
                        ? renderCategory()
                        : view === "table"
                        ? renderTable()
                        : view === "tune"
                        ? <WeightageTuning 
                            questions={questions}
                            userAnswers={userAnswers}
                            onSubmit={updateUserAnswers}
                            onClose={() => setView("chart")}
                        />
                        : null}
                </div>
            </>
        );
    }
}
