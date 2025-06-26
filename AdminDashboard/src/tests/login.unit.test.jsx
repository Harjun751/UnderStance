import {
    waitFor,
    // cleanup,
    // fireEvent,
    render,
    screen,
} from "@testing-library/react";

import LoginPage from "../components/auth/LoginPage";

/* TO BE TESTED: Successful/failed logins with auth module */
describe("input form", () => {
    test("should be visible", async () => {
        render(<LoginPage />);

        let ele;
        await waitFor(() => {
            ele = screen.getByRole("heading");
            expect(ele).toBeInTheDocument();
        });

        expect(screen.getByRole("button", { name: /Login/i })).toBeVisible();
    });
});
