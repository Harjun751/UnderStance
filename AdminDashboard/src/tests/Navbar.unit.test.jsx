import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

describe("Navbar Component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );
    });

    test("renders all main sections and nav items when expanded", () => {
        // Logo text visible when expanded
        expect(screen.getByText(/understance/i)).toBeInTheDocument();

        // Sections titles visible
        expect(screen.getByText(/home/i)).toBeInTheDocument();
        expect(screen.getByText(/management/i)).toBeInTheDocument();
        expect(screen.getByText(/account/i)).toBeInTheDocument();

        // Nav items visible by name when expanded
        expect(screen.getByText(/^dashboard$/i)).toBeInTheDocument();
        expect(screen.getByText(/^analytics$/i)).toBeInTheDocument();
        expect(screen.getByText(/^category$/i)).toBeInTheDocument();
        expect(screen.getByText(/^quiz$/i)).toBeInTheDocument();
        expect(screen.getByText(/^stance$/i)).toBeInTheDocument();
        expect(screen.getByText(/^party$/i)).toBeInTheDocument();

        // Footer buttons visible by name
        expect(screen.getByText(/^settings$/i)).toBeInTheDocument();
        expect(screen.getByText(/^logout$/i)).toBeInTheDocument();
    });

    test("toggles collapsed state on toggle button click", () => {
        const toggleButton = screen.getByRole("button", {
            name: /collapse navbar|expand navbar/i,
        });

        // Initially expanded, logo text visible
        expect(screen.getByText(/understance/i)).toBeInTheDocument();

        fireEvent.click(toggleButton);

        // After click, navbar collapsed, so logo text not visible
        expect(screen.queryByText(/understance/i)).not.toBeInTheDocument();

        fireEvent.click(toggleButton);

        // Expanded again, logo text visible
        expect(screen.getByText(/understance/i)).toBeInTheDocument();
    });

    test("navlink onClick toggles collapsed state", () => {
        // Find the Dashboard NavLink
        const dashboardLink = screen.getByText(/dashboard/i).closest("a");
        expect(dashboardLink).toBeInTheDocument();

        // Click dashboard link (should toggle collapsed state)
        fireEvent.click(dashboardLink);

        // Logo text should disappear as collapsed toggled to true
        expect(screen.queryByText(/understance/i)).not.toBeInTheDocument();
    });
});
