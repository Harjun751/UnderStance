import { render, screen, fireEvent } from "@testing-library/react";
import AddItem from "../components/Management/AddItem"; // adjust path if needed
import { vi } from "vitest";

describe("AddItem Component", () => {
    const title = "Test Item";

    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const mockSchema = [
        { name: "name", type: "string" },
        {
            name: "active",
            type: "boolean",
            booleanData: { trueLabel: "Yes", falseLabel: "No" },
        },
    ];

    beforeEach(() => {
        onClose.mockReset();
        onSubmit.mockReset();
    });

    test("renders form based on mock Schema excluding id", () => {
        render(
            <AddItem
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                schema={mockSchema}
            />,
        );

        expect(screen.getByText(`Add New ${title}`)).toBeInTheDocument();

        // Name should render string input as textarea
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /name/i })).toBeVisible();

        // Active should render boolean select dropdown
        expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: /active/i })).toBeVisible();


        // Save button should initially be disabled
        expect(screen.getByRole("button", { name: /save question/i })).toBeDisabled();
    });

    test("enables submit when all fields are filled and submits data", () => {
        render(
            <AddItem
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                schema={mockSchema}
            />
        );

        const nameInput = screen.getByRole("textbox", { name: /name/i });
        const activeSelect = screen.getByRole("combobox", { name: /active/i });
        const submitBtn = screen.getByRole("button", { name: /save question/i });

        // Fill form
        fireEvent.change(nameInput, { target: { value: "Test Name" } });
        fireEvent.change(activeSelect, { target: { value: "true" } });

        expect(submitBtn).not.toBeDisabled();

        // Submit
        fireEvent.click(submitBtn);

        expect(onSubmit).toHaveBeenCalledWith({
            name: "Test Name",
            active: true,
        });
        expect(onClose).toHaveBeenCalled();
    });

    test("calls onClose without submitting when Cancel clicked", () => {
        render(
            <AddItem
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                schema={mockSchema}
            />,
        );

        const cancelBtn = screen.getByRole("button", { name: /cancel/i });
        fireEvent.click(cancelBtn);

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
