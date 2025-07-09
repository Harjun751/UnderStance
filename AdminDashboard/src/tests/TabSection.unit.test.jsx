import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TabSection from "../components/dashboard/TabSection";

// Dummy props
const mockData = {
    questions: [
        { IssueID: 1, Active: true }, 
        { IssueID: 2, Active: false }
    ],
    categories: [
        { id: 1 }, 
        { id: 2 }
    ],
    parties: [
        { PartyID: 1, Active: true }
    ],
    stances: [
        { StanceId: 1, Party: "Coalition for Shakira", IssueID: 2 },
        { StanceID: 2, Party: "Other Party", IssueID: 3 },
    ],
};

const mockDashData = {
    tabs: {
        quiz: [],
        category: [],
        party: [],
        stance: [],
    },
    overall: [],
};

const updateDashDataHandler = vi.fn();

describe("TabSection", () => {
    beforeEach(() => {
        render(
        <MemoryRouter>
            <TabSection
                {...mockData}
                dashData={mockDashData}
                updateDashDataHandler={updateDashDataHandler}
            />
        </MemoryRouter>
        );
    });

    it("renders default Quiz tab", () => {
        expect(screen.getByRole("tab", { name: /quiz/i })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Total Questions")).toBeInTheDocument();
    });

    it("switches to Category tab on click", () => {
        fireEvent.click(screen.getByRole("tab", { name: /category/i }));
        expect(screen.getByRole("tab", { name: /category/i })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Total Categories")).toBeInTheDocument();
    });

    it("renders Edit Display button and triggers modal open", () => {
        fireEvent.click(screen.getByText("Edit Display"));
        expect(screen.getByText("Edit Display")).toBeInTheDocument();
        expect(screen.getByText(/customize overall section/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("renders redirect button with correct text", () => {
        expect(screen.getByRole("button", { name: /view quiz management page/i })).toBeInTheDocument();
    });
});