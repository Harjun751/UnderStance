import {
    waitFor,
    cleanup,
    fireEvent,
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
            ele = screen.getByRole("textbox", { name: /email/i });
            expect(ele).toBeInTheDocument();
        });

        expect(
            screen.getByRole("textbox", { name: /email/i } )
        ).toBeVisible()
        expect(
            screen.getByLabelText(/password/i)
        ).toBeVisible()
        expect(
            screen.getByRole("checkbox", { name: /Remember me/i } )
        ).toBeVisible()
        expect(
            screen.getByRole("button", { name: /Login/i } )
        ).toBeVisible()

    });
});
