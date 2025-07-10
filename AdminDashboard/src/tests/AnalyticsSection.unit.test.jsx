import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AnalyticsSection from "../components/dashboard/AnalyticsSection";
import { vi } from "vitest";

const sampleData = [
    {
        date: "20250101",
        activeUsers: "10",
        newUsers: "5",
        screenPageViews: "50",
    },
    {
        date: "20250102",
        activeUsers: "15",
        newUsers: "10",
        screenPageViews: "70",
    },
    {
        date: "20250103",
        activeUsers: "5",
        newUsers: "3",
        screenPageViews: "30",
    },
];

describe("AnalyticsSection", () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });
    it("renders 'No data available' when no data is provided", () => {
        render(<AnalyticsSection initData={[]} />);
        expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders analytics section with stats and chart", async () => {
        render(<AnalyticsSection initData={sampleData} />);
        expect(screen.getByText("Website Traffic")).toBeInTheDocument();
        expect(screen.getByText("Total Users")).toBeInTheDocument();
        expect(screen.getByText("New Users")).toBeInTheDocument();
        expect(screen.getByText("Total Page Views")).toBeInTheDocument();

        // Check stats values
        expect(await screen.findByText("30")).toBeInTheDocument(); // 10+15+5 activeUsers
        expect(await screen.findByText("18")).toBeInTheDocument(); // 5+10+3 newUsers
        expect(await screen.findByText("150")).toBeInTheDocument(); // 50+70+30 pageViews
    });

    it("renders date input controls correctly", () => {
        render(<AnalyticsSection initData={sampleData} />);
        expect(screen.getByLabelText("From:")).toBeInTheDocument();
        expect(screen.getByLabelText("To:")).toBeInTheDocument();
    });

    it("filters data correctly when date range is changed", async () => {
        render(<AnalyticsSection initData={sampleData} />);

        // Wait for initial state setup
        await waitFor(() => {
            expect(screen.getByLabelText("From:").value).toBe("2025-01-01");
            expect(screen.getByLabelText("To:").value).toBe("2025-01-03");
        });

        fireEvent.change(screen.getByLabelText("From:"), {
            target: { value: "2025-01-02" },
        });

        await waitFor(() => {
            expect(screen.getByText("20")).toBeInTheDocument();
            expect(screen.getByText("13")).toBeInTheDocument();
            expect(screen.getByText("100")).toBeInTheDocument();
        });
    });

    it("skips invalid date entries", () => {
        const consoleSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => {});
        const invalidData = [
            ...sampleData,
            {
                date: "invalid",
                activeUsers: "1",
                newUsers: "1",
                screenPageViews: "1",
            },
        ];
        render(<AnalyticsSection initData={invalidData} />);
        expect(consoleSpy).toHaveBeenCalledWith(
            "Skipping invalid date:",
            "invalid",
        );
        consoleSpy.mockRestore();
    });
});
