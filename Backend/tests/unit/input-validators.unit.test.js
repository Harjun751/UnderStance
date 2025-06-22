const validator = require("../../services/InputValidation");

// used for image validation
global.fetch = jest.fn();


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
        expect(validator.validateID(2)).toBe(true);
    });

    test("should fail on invalid IssueID - NaN", async () => {
        expect(validator.validateID(Number("hi"))).toBe(false);
    });

    test("should fail on null IssueID", async () => {
        expect(validator.validateID(null)).toBe(false);
    });

    test("should fail on undefined IssueID", async () => {
        let id;
        expect(validator.validateID(id)).toBe(false);
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
    test("should pass on valid fetch", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: (header) => header === 'content-type' ? 'image/png' : null,
            }
        });
        expect(await validator.validateIcon("https://image.com")).toBe(true);
    });

    test("should fail on invalid icon", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: (header) => header === 'content-type' ? 'video/png' : null,
            }
        });
        expect(await validator.validateIcon("12345")).toBe(false);
    });

    test("should fail on invalid Icon - > 2083 chars", async () => {
        expect(await validator.validateIcon(`
        this description is > 2083 chars long 
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            `)).toBe(false);
    });

    test("should fail on null Icon", async () => {
        expect(await validator.validateIcon(null)).toBe(false);
    });

    test("should fail on undefined Icon", async () => {
        let summ;
        expect(await validator.validateIcon(summ)).toBe(false);
    });
});

describe("PartyColor validator", () => {
    test("should pass for valid color", async () => {
        expect(validator.validateColor("#FFFFFF")).toBe(true);
    });

    test("should fail for invalid color", async () => {
        expect(validator.validateColor("red")).toBe(false);
    });

    test("should fail for invalid color", async () => {
        expect(validator.validateColor("rgb(0,0,0,)")).toBe(false);
    });

    test("should fail for null", async () => {
        expect(validator.validateColor(null)).toBe(false);
    });

    test("should fail for undefined", async () => {
        let col;
        expect(validator.validateColor(col)).toBe(false);
    });

});
