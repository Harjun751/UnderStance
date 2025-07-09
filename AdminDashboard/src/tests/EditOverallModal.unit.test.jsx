import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditOverallModal from "../components/dashboard/EditOverallModal";

const mockData = {
  questions: [{ IssueID: 1, Topic: "Economy" }],
  categories: [{ CategoryID: 1, Name: "Finance" }],
  parties: [{ PartyID: 1, Name: "Alpha" }],
  stances: [{ StanceID: 1, PartyID: 1, IssueID: 1, stance: "agree" }],
};

describe("EditOverallModal", () => {
    it("renders in add mode with default values", () => {
        render(
        <EditOverallModal
            onClose={vi.fn()}
            onSave={vi.fn()}
            onUpdate={vi.fn()}
            onDelete={vi.fn()}
            onReorder={vi.fn()}
            data={mockData}
            cards={[]}
        />
        );

        expect(screen.getByText("Customize Overall Section")).toBeInTheDocument();
        expect(screen.getByText((t) => t.includes("Adding a new Card"))).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("calls onSave with correct card data when form is submitted", async () => {
        const onSave = vi.fn();
        render(
        <EditOverallModal
            onClose={vi.fn()}
            onSave={onSave}
            onUpdate={vi.fn()}
            onDelete={vi.fn()}
            onReorder={vi.fn()}
            data={mockData}
            cards={[]}
        />
        );

        // Title
        const input = await screen.findByPlaceholderText("Enter card title");
        fireEvent.change(input, { target: { value: "My Card" } });

        // Submit
        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({
            dataType: "questions",
            action: "count",
            color: "blue",
            title: "My Card",
            filter: expect.any(Array),
            })
        );
        });
    });

    it("toggles to edit mode and renders card list", () => {
        render(
        <EditOverallModal
            onClose={vi.fn()}
            onSave={vi.fn()}
            onUpdate={vi.fn()}
            onDelete={vi.fn()}
            onReorder={vi.fn()}
            data={mockData}
            cards={[{ title: "Card A", dataType: "questions", field: "IssueID", action: "count", color: "blue", filter: [] }]}
        />
        );

        fireEvent.click(screen.getByText("Edit Card"));

        expect(screen.getByText("Card A")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("calls onDelete when Delete is clicked", () => {
        const onDelete = vi.fn();

        render(
        <EditOverallModal
            onClose={vi.fn()}
            onSave={vi.fn()}
            onUpdate={vi.fn()}
            onDelete={onDelete}
            onReorder={vi.fn()}
            data={mockData}
            cards={[{ title: "Card A", dataType: "questions", field: "IssueID", action: "count", color: "blue", filter: [] }]}
        />
        );

        fireEvent.click(screen.getByText("Edit Card"));
        fireEvent.click(screen.getByText("Delete"));

        expect(onDelete).toHaveBeenCalledWith(0);
    });

    it("calls onReorder when reorder buttons are clicked", () => {
        const onReorder = vi.fn();
        const cards = [
        { title: "Card A", dataType: "questions", field: "IssueID", action: "count", color: "blue", filter: [] },
        { title: "Card B", dataType: "questions", field: "IssueID", action: "count", color: "blue", filter: [] },
        ];

        render(
        <EditOverallModal
            onClose={vi.fn()}
            onSave={vi.fn()}
            onUpdate={vi.fn()}
            onDelete={vi.fn()}
            onReorder={onReorder}
            data={mockData}
            cards={cards}
        />
        );

        fireEvent.click(screen.getByText("Edit Card"));
        const downBtn = screen.getAllByRole("button", { name: "↓" })[0];
        fireEvent.click(downBtn);

        expect(onReorder).toHaveBeenCalledWith([
        cards[1],
        cards[0],
        ]);
    });
});