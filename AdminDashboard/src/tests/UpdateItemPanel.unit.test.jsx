/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateItemPanel from "../components/Management/UpdateItemPanel";

// Sample item with string and boolean fields
const mockItem = {
    id: 1,
    name: "Sample Name",
    active: true,
};

describe("UpdateItemPanel Component", () => {
    let handleClose, handleSubmit;

    beforeEach(() => {
        handleClose = vi.fn();
        handleSubmit = vi.fn();
        render(
            <UpdateItemPanel
                item={mockItem}
                onClose={handleClose}
                onSubmit={handleSubmit}
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

        fireEvent.click(screen.getByRole("button", { name: /Update Entry/i }));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith({
                ...mockItem,
                name: "Updated Name",
            });
            expect(handleClose).toHaveBeenCalled();
        });
    });

    test("Calls onClose when Cancel is clicked", async () => {
        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
        expect(handleClose).toHaveBeenCalled();
    });

    test("Toggles panel width on expand button click", () => {
        const expandBtn = screen.getByRole("button", {
            name: /Expand Panel/i,
        });
        fireEvent.click(expandBtn);

        const panel = screen.getByText(/Quick View\/Edit/i).closest("div");
        expect(panel.className).toContain("expanded");
    });
});
