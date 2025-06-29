/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateItemPanel from "../components/Management/UpdateItemPanel";

// Sample item with string and boolean fields
const mockItem = {
    id: 1,
    name: "Sample Name",
    active: true,
};

const mockSchema = [
    { name: "id", type: "id" },
    { name: "name", type: "string" },
    {
        name: "active",
        type: "boolean",
        booleanData: {
            trueLabel: "Yes",
            falseLabel: "No",
        },
    },
];

describe("UpdateItemPanel Component", () => {
    let handleClose, handleSubmit, handleDelete;

    beforeEach(() => {
        handleClose = vi.fn();
        handleSubmit = vi.fn();
        handleDelete = vi.fn();
        render(
            <UpdateItemPanel
                item={mockItem}
                schema={mockSchema}
                onClose={handleClose}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                isExpanded={false}
            />,
        );
    });

    test("Renders panel with item fields", async () => {
        expect(screen.getByText(/Quick View\/Edit/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeVisible();
        expect(screen.getByLabelText(/active/i)).toBeVisible();
        expect(
            screen.getByRole("button", { name: /Update Entry/i }),
        ).toBeVisible();
    });

    test("Changes field value and submits form", async () => {
        const nameInput = screen.getByLabelText(/name/i);
        fireEvent.change(nameInput, { target: { value: "Updated Name" } });

        const submitButton = screen.getByRole("button", {
            name: /Update Entry/i,
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith({
                id: 1,
                name: "Updated Name",
                active: true,
            });
            expect(handleClose).toHaveBeenCalled();
        });
    });

    test("Calls onClose when Cancel is clicked", async () => {
        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
        expect(handleClose).toHaveBeenCalled();
    });

    test("Calls onDelete when Delete is clicked", () => {
        fireEvent.click(screen.getByRole("button", { name: /Delete Entry/i }));
        expect(handleDelete).toHaveBeenCalledWith({
            id: 1,
            name: "Sample Name",
            active: true,
        });
        expect(handleClose).toHaveBeenCalled();
    });

    test("disables Update button if no changes", () => {
        const updateButton = screen.getByRole("button", {
            name: /Update Entry/i,
        });
        expect(updateButton).toBeDisabled();
    });
});
