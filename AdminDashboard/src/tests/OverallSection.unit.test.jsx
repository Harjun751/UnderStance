import { render, screen, fireEvent } from "@testing-library/react";
import OverallSection from "../components/dashboard/OverallSection";

const mockQuestions = [{ IssueID: 1 }, { IssueID: 2 }];
const mockCategories = [{ CategoryID: 1 }];
const mockParties = [{ PartyID: 1 }];
const mockStances = [{ StanceID: 1 }];
const defaultProps = {
    questions: mockQuestions,
    categories: mockCategories,
    parties: mockParties,
    stances: mockStances,
};

describe("OverallSection", () => {
    it("renders default cards when dashData.overall is empty", () => {
        render(
            <OverallSection
                {...defaultProps}
                dashData={{ overall: [] }}
                updateDashDataHandler={vi.fn()}
            />,
        );

        expect(screen.getByText("Total Questions")).toBeInTheDocument();
        expect(screen.getByText("Total Categories")).toBeInTheDocument();
        expect(screen.getByText("Total Parties")).toBeInTheDocument();
        expect(screen.getByText("Total Stances")).toBeInTheDocument();
    });

    it("renders custom cards when dashData.overall is provided", () => {
        const customCards = [
            {
                dataType: "questions",
                field: "IssueID",
                action: "count",
                filter: [],
                color: "blue",
                title: "Custom Question Card",
            },
        ];

        render(
            <OverallSection
                {...defaultProps}
                dashData={{ overall: customCards }}
                updateDashDataHandler={vi.fn()}
            />,
        );

        expect(screen.getByText("Custom Question Card")).toBeInTheDocument();
    });

    it("opens modal when Edit Display button is clicked", () => {
        render(
            <OverallSection
                {...defaultProps}
                dashData={{ overall: [] }}
                updateDashDataHandler={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByText("Edit Display"));
        expect(
            screen.getByText(/Customize Overall Section/i),
        ).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });
});
