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

describe("active validator", () => {
    test("should pass on valid boolean true string", async () => {
        expect(validator.validateActive("true")).toBe(true);
    });

    test("should pass on valid boolean false string", async () => {
        expect(validator.validateActive("false")).toBe(true);
    });

    test("should pass on valid boolean true", async () => {
        expect(validator.validateActive(true)).toBe(true);
    });

    test("should pass on valid boolean false", async () => {
        expect(validator.validateActive(false)).toBe(true);
    });

    test("should fail on null boolean", async () => {
        expect(validator.validateActive(null)).toBe(false);
    });

    test("should fail on undefined", async () => {
        let bool;
        expect(validator.validateActive(bool)).toBe(false);
    });
});

describe("boolean convertor", () => {
    test("should convert true string to true", async () => {
        expect(validator.convertToBoolean("true")).toBe(true);
    });

    test("should convert false string to false", async () => {
        expect(validator.convertToBoolean("false")).toBe(false);
    });
});

describe("party name validator", () => {
    test("should pass on valid name", async () => {
        expect(validator.validatePartyName("Party party")).toBe(true);
    });

    test("should fail on invalid PartyName - > 100 chars", async () => {
        expect(validator.validatePartyName(`
        this description is > 100 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `)).toBe(false);
    });

    test("should fail on null PartyName", async () => {
        expect(validator.validatePartyName(null)).toBe(false);
    });

    test("should fail on undefined PartyName", async () => {
        let summ;
        expect(validator.validatePartyName(summ)).toBe(false);
    });
});

describe("short party name validator", () => {
    test("should pass on valid name", async () => {
        expect(validator.validateShortName("12345")).toBe(true);
    });
    test("should fail on invalid ShortName - > 100 chars", async () => {
        expect(validator.validateShortName(`
        this description is > 100 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `)).toBe(false);
    });

    test("should fail on null ShortName", async () => {
        expect(validator.validateShortName(null)).toBe(false);
    });

    test("should fail on undefined ShortName", async () => {
        let summ;
        expect(validator.validateShortName(summ)).toBe(false);
    });
});

describe("icon url validator", () => {
    test("should pass on valid icon", async () => {
        expect(validator.validateIcon("12345")).toBe(true);
    });
    test("should fail on invalid Icon - > 2083 chars", async () => {
        expect(validator.validateIcon(`
        this description is > 2083 chars long 
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            `)).toBe(false);
    });

    test("should fail on null Icon", async () => {
        expect(validator.validateIcon(null)).toBe(false);
    });

    test("should fail on undefined Icon", async () => {
        let summ;
        expect(validator.validateIcon(summ)).toBe(false);
    });
});
