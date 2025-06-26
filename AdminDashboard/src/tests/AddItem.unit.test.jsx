import { render, screen, fireEvent } from "@testing-library/react";
import AddItem from "../components/Management/AddItem"; // adjust path if needed
import { vi } from "vitest";

describe("AddItem Component", () => {
    const headers = ["id", "name", "active"];
    const title = "Test Item";
    const sampleItem = { name: "", active: true };

    const onClose = vi.fn();
    const onSubmit = vi.fn();

    beforeEach(() => {
        onClose.mockReset();
        onSubmit.mockReset();
    });

    test("renders form with headers excluding id", () => {
        render(
            <AddItem
                headers={headers}
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                sampleItem={sampleItem}
            />,
        );

        expect(screen.getByText(`Add New ${title}`)).toBeInTheDocument();

        // "id" label should NOT be present
        expect(screen.queryByText("id")).not.toBeInTheDocument();

        // "name" and "active" labels should be present
        expect(screen.getByText("name")).toBeInTheDocument();
        expect(screen.getByText("active")).toBeInTheDocument();

        // textarea for "name"
        expect(
            screen.getByRole("textbox", { name: /name/i }),
        ).toBeInTheDocument();

        // select for "active"
        expect(
            screen.getByRole("combobox", { name: /active/i }),
        ).toBeInTheDocument();
    });

    test("handles text input and boolean select changes", () => {
        render(
            <AddItem
                headers={headers}
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                sampleItem={sampleItem}
            />,
        );

        const nameInput = screen.getByRole("textbox", { name: /name/i });
        const activeSelect = screen.getByRole("combobox", { name: /active/i });

        // Change textarea value
        fireEvent.change(nameInput, { target: { value: "New Name" } });
        expect(nameInput.value).toBe("New Name");

        // Change select value (boolean)
        fireEvent.change(activeSelect, { target: { value: "False" } });
        expect(activeSelect.value).toBe("False");

        fireEvent.change(activeSelect, { target: { value: "True" } });
        expect(activeSelect.value).toBe("True");
    });

    test("calls onClose when Cancel button clicked", () => {
        render(
            <AddItem
                headers={headers}
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                sampleItem={sampleItem}
            />,
        );

        const cancelBtn = screen.getByRole("button", { name: /cancel/i });
        fireEvent.click(cancelBtn);

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test("calls onSubmit with form data and onClose on form submit", () => {
        render(
            <AddItem
                headers={headers}
                title={title}
                onClose={onClose}
                onSubmit={onSubmit}
                sampleItem={sampleItem}
            />,
        );

        const textareas = screen.getAllByRole("textbox");
        const nameInput = textareas[0]; // first textarea

        const selects = screen.getAllByRole("combobox");
        const activeSelect = selects[0]; // first select

        const submitBtn = screen.getByRole("button", {
            name: /save question/i,
        });

        // Fill form
        fireEvent.change(nameInput, { target: { value: "Submitted Name" } });
        fireEvent.change(activeSelect, { target: { value: "False" } });

        // Submit form
        fireEvent.click(submitBtn);

        expect(onSubmit).toHaveBeenCalledWith({
            name: "Submitted Name",
            active: false, // note conversion from "False" string to boolean false
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
