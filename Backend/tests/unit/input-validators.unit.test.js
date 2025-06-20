const validator = require("../../services/InputValidation");

describe("description validator", () => {
    test("should pass on valid description", async () => {
        expect(validator.validateDescription("hi!")).toBe(true);
    });

    test("should fail on invalid description - > 300 chars", async () => {
        expect(validator.validateDescription(`
        this description is > 300 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `)).toBe(false);
    });

    test("should fail on null description", async () => {
        expect(validator.validateDescription(null)).toBe(false);
    });

    test("should fail on undefined description", async () => {
        let desc;
        expect(validator.validateDescription(desc)).toBe(false);
    });
});

describe("summary validator", () => {
    test("should pass on valid summary", async () => {
        expect(validator.validateSummary("hi!")).toBe(true);
    });

    test("should fail on invalid summary - > 50 chars", async () => {
        expect(validator.validateSummary(`
        this description is > 50 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `)).toBe(false);
    });

    test("should fail on null summary", async () => {
        expect(validator.validateSummary(null)).toBe(false);
    });

    test("should fail on undefined summary", async () => {
        let summ;
        expect(validator.validateSummary(summ)).toBe(false);
    });
});

describe("category validator", () => {
    test("should pass on valid category", async () => {
        expect(validator.validateCategory("hi!")).toBe(true);
    });

    test("should fail on invalid category - > 50 chars", async () => {
        expect(validator.validateCategory(`
        this description is > 50 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `)).toBe(false);
    });

    test("should fail on null category", async () => {
        expect(validator.validateCategory(null)).toBe(false);
    });

    test("should fail on undefined category", async () => {
        let cat;
        expect(validator.validateCategory(cat)).toBe(false);
    });
});

describe("issueid validator", () => {
    test("should pass on valid IssueID", async () => {
        expect(validator.validateIssueID(2)).toBe(true);
    });

    test("should fail on invalid IssueID - NaN", async () => {
        expect(validator.validateIssueID(Number("hi"))).toBe(false);
    });

    test("should fail on null IssueID", async () => {
        expect(validator.validateIssueID(null)).toBe(false);
    });

    test("should fail on undefined IssueID", async () => {
        let id;
        expect(validator.validateIssueID(id)).toBe(false);
    });
});
