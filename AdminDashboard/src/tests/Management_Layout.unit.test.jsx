import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from "@testing-library/react";
import Management_Layout from "../components/Management/Management_Layout";
import { vi } from "vitest";

// Mock Layout, AddItem, and UpdateItemPanel to simplify test
vi.mock("../components/general/Layout", () => ({
    default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../components/Management/AddItem", () => ({
    default: () => <div data-testid="add-item-panel">AddItemPanel</div>,
}));
vi.mock("../components/Management/UpdateItemPanel", () => ({
    default: () => <div data-testid="update-item-panel">UpdateItemPanel</div>,
}));

const sampleData = [
    { id: 1, name: "First Item", active: true },
    { id: 2, name: "Second Item", active: false },
];

const mockSchema = [
    { name: "id", type: "id" },
    { name: "name", type: "string", filterable: true },
    { name: "active", type: "boolean", filterable: true },
];

describe("Management_Layout Component", () => {
    test("Renders table headers and rows", () => {
        render(
            <Management_Layout
                title="Test"
                data={sampleData}
                schema={mockSchema}
                isLoading={false}
                addSubmitHandler={vi.fn()}
                updateSubmitHandler={vi.fn()}
                deleteSubmitHandler={vi.fn()}
            />,
        );

        expect(screen.getByText("Test List")).toBeInTheDocument();

        const tableBody = screen.getAllByRole("rowgroup")[1];

        expect(within(tableBody).getByText("First Item")).toBeInTheDocument();
        expect(within(tableBody).getByText("Second Item")).toBeInTheDocument();
    });

    test("Renders FaCheck and FaTimes icons for boolean values", () => {
        render(
            <Management_Layout
                title="Test"
                data={sampleData}
                schema={mockSchema}
                isLoading={false}
                addSubmitHandler={vi.fn()}
                updateSubmitHandler={vi.fn()}
                deleteSubmitHandler={vi.fn()}
            />,
        );

        const trueIcon = document.querySelector(".boolean-true");
        const falseIcon = document.querySelector(".boolean-false");

        expect(trueIcon).toBeInTheDocument();
        expect(falseIcon).toBeInTheDocument();
        expect(trueIcon.tagName).toBe("svg");
        expect(falseIcon.tagName).toBe("svg");
    });

    test("Successfully filters items based on search input", () => {
        render(
            <Management_Layout
                title="Test"
                data={sampleData}
                schema={mockSchema}
                isLoading={false}
                addSubmitHandler={vi.fn()}
                updateSubmitHandler={vi.fn()}
                deleteSubmitHandler={vi.fn()}
            />,
        );

        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: "Second" } });

        const rowgroups = screen.getAllByRole("rowgroup");
        const tableBody = rowgroups[1];

        expect(
            within(tableBody).queryByText("First Item"),
        ).not.toBeInTheDocument();
        expect(within(tableBody).getByText("Second Item")).toBeInTheDocument();
    });

    test("Opens AddItem modal when Add button clicked", async () => {
        render(
            <Management_Layout
                title="Test"
                data={sampleData}
                schema={mockSchema}
                isLoading={false}
                addSubmitHandler={vi.fn()}
                updateSubmitHandler={vi.fn()}
                deleteSubmitHandler={vi.fn()}
            />,
        );
        const addButton = screen.getByRole("button", { name: /Add Test/i });

        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId("add-item-panel")).toBeInTheDocument();
        });
    });

    test("Opens UpdateItemPanel on row click", async () => {
        render(
            <Management_Layout
                title="Test"
                data={sampleData}
                schema={mockSchema}
                isLoading={false}
                addSubmitHandler={vi.fn()}
                updateSubmitHandler={vi.fn()}
                deleteSubmitHandler={vi.fn()}
            />,
        );

        // Use role="table" to scope correctly to the table
        const table = screen.getByRole("table");

        // Get all data rows (excluding header row)
        const rows = within(table).getAllByRole("row").slice(1);

        // Find the one with "First Item"
        const targetRow = rows.find((row) =>
            within(row).queryByText("First Item"),
        );

        // Click on the row
        fireEvent.click(targetRow);

        // Assert UpdateItemPanel is shown
        await waitFor(() => {
            expect(screen.getByTestId("update-item-panel")).toBeInTheDocument();
        });
    });
});
