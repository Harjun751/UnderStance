import {
    waitFor,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import { useLocation } from "react-router-dom";

import ReadStances from "../../components/ReadStancesPage/ReadStances";

beforeEach(() => {
    const mockFetchCall = vi
        .fn()
        .mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve([
                    {
                        StanceID: 1,
                        Stand: true,
                        Reason: "TEST: it's a bop",
                        IssueID: 1,
                        PartyID: 1,
                    },
                ]),
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve([
                    {
                        PartyID: 1,
                        Name: "Test Party",
                        ShortName: "TP",
                        Icon: "...",
                    },
                ]),
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve([
                    {
                        IssueID: 1,
                        Description: "First Test",
                        Summary: "First Test",
                    },
                    {
                        IssueID: 2,
                        Description: "Second Test",
                        Summary: "Second Test",
                    },
                ]),
        });

    global.fetch = mockFetchCall;

    vi.mock(import("react-router-dom"), async (importOriginal) => {
        const mod = await importOriginal();
        return {
            ...mod,
            useLocation: vi
                .fn()
                .mockResolvedValue({ state: { answers: null } }),
        };
    });
});

describe("filters when search is input", () => {
    test("empty search shows all", async () => {
        render(<ReadStances />);

        let ele;
        await waitFor(() => {
            ele = screen.getByRole("heading", { name: /Stance Breakdown/i });
            expect(ele).toBeInTheDocument();
        });

        const firstIssue = screen.getByText(/First Test/i);
        const secondIssue = screen.getByText(/Second Test/i);

        expect(firstIssue).toBeVisible();
        expect(secondIssue).toBeVisible();
    });

    test("search makes other elements invisible", async () => {
        render(<ReadStances />);

        let ele;
        await waitFor(() => {
            ele = screen.getByRole("heading", { name: /Stance Breakdown/i });
            expect(ele).toBeInTheDocument();
        });

        // ACT: input value
        const input = screen.getByRole("textbox", { name: /search/i });
        fireEvent.change(input, { target: { value: "First Test" } });

        const listItems = screen.getAllByRole("listitem", { hidden: true });
        const firstIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "1",
        );
        const secondIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "2",
        );

        expect(firstIssue).toBeVisible();
        expect(secondIssue).not.toBeVisible();
    });

    test("search filters out first item", async () => {
        render(<ReadStances />);

        let ele;
        await waitFor(() => {
            ele = screen.getByRole("heading", { name: /Stance Breakdown/i });
            expect(ele).toBeInTheDocument();
        });

        // ACT: input value
        const input = screen.getByRole("textbox", { name: /search/i });
        fireEvent.change(input, { target: { value: "Second Test" } });

        const listItems = screen.getAllByRole("listitem", { hidden: true });
        const firstIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "1",
        );
        const secondIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "2",
        );

        expect(firstIssue).not.toBeVisible();
        expect(secondIssue).toBeVisible();
    });

    test("search is case insensitive", async () => {
        render(<ReadStances />);

        let ele;
        await waitFor(() => {
            ele = screen.getByRole("heading", { name: /Stance Breakdown/i });
            expect(ele).toBeInTheDocument();
        });

        // ACT: input value
        const input = screen.getByRole("textbox", { name: /search/i });
        fireEvent.change(input, { target: { value: "first test" } });

        const listItems = screen.getAllByRole("listitem", { hidden: true });
        const firstIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "1",
        );
        const secondIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "2",
        );

        expect(firstIssue).toBeVisible();
        expect(secondIssue).not.toBeVisible();
    });

    test("search filters all elements out", async () => {
        render(<ReadStances />);

        let ele;
        await waitFor(() => {
            ele = screen.getByRole("heading", { name: /Stance Breakdown/i });
            expect(ele).toBeInTheDocument();
        });

        // ACT: input value
        const input = screen.getByRole("textbox", { name: /search/i });
        fireEvent.change(input, { target: { value: "dingle wingle" } });

        const listItems = screen.getAllByRole("listitem", { hidden: true });
        const firstIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "1",
        );
        const secondIssue = listItems.find(
            (item) => item.getAttribute("issueid") === "2",
        );

        expect(firstIssue).not.toBeVisible();
        expect(secondIssue).not.toBeVisible();
    });
});
