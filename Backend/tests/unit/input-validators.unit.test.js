const validator = require("../../services/InputValidation");

// used for image validation
global.fetch = jest.fn();

describe("description validator", () => {
    test("should pass on valid description", async () => {
        expect(validator.validateDescription("hi!")).toBe(null);
    });

    test("should fail on invalid description - > 300 chars", async () => {
        expect(
            validator.validateDescription(`
        this description is > 300 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `),
        ).toBe("Too long, >300 characters");
    });

    test("should fail on null description", async () => {
        expect(validator.validateDescription(null)).toBe("No value provided");
    });

    test("should fail on undefined description", async () => {
        let desc;
        expect(validator.validateDescription(desc)).toBe("No value provided");
    });
});

describe("summary validator", () => {
    test("should pass on valid summary", async () => {
        expect(validator.validateSummary("hi!")).toBe(null);
    });

    test("should fail on invalid summary - > 50 chars", async () => {
        expect(
            validator.validateSummary(`
        this description is > 50 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `),
        ).toBe("Too long, > 50 characters");
    });

    test("should fail on null summary", async () => {
        expect(validator.validateSummary(null)).toBe("No value provided");
    });

    test("should fail on undefined summary", async () => {
        let summ;
        expect(validator.validateSummary(summ)).toBe("No value provided");
    });
});

describe("category validator", () => {
    test("should pass on valid category", async () => {
        expect(validator.validateCategory("hi!")).toBe(null);
    });

    test("should fail on invalid category - > 50 chars", async () => {
        expect(
            validator.validateCategory(`
        this description is > 50 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `),
        ).toBe("Too long, > 50 characters");
    });

    test("should fail on null category", async () => {
        expect(validator.validateCategory(null)).toBe("No value provided");
    });

    test("should fail on undefined category", async () => {
        let cat;
        expect(validator.validateCategory(cat)).toBe("No value provided");
    });
});

describe("issueid validator", () => {
    test("should pass on valid IssueID", async () => {
        expect(validator.validateID(2)).toBe(null);
    });

    test("should fail on invalid IssueID - NaN", async () => {
        expect(validator.validateID(Number("hi"))).toBe("No value provided");
    });

    test("should fail on null IssueID", async () => {
        expect(validator.validateID(null)).toBe("No value provided");
    });

    test("should fail on undefined IssueID", async () => {
        let id;
        expect(validator.validateID(id)).toBe("No value provided");
    });
});

describe("active validator", () => {
    test("should pass on valid boolean true string", async () => {
        expect(validator.validateActive("true")).toBe(null);
    });

    test("should pass on valid boolean false string", async () => {
        expect(validator.validateActive("false")).toBe(null);
    });

    test("should pass on valid boolean true", async () => {
        expect(validator.validateActive(true)).toBe(null);
    });

    test("should pass on valid boolean false", async () => {
        expect(validator.validateActive(false)).toBe(null);
    });

    test("should fail on null boolean", async () => {
        expect(validator.validateActive(null)).toBe("No value provided");
    });

    test("should fail on undefined", async () => {
        let bool;
        expect(validator.validateActive(bool)).toBe("No value provided");
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
        expect(validator.validatePartyName("Party party")).toBe(null);
    });

    test("should fail on invalid PartyName - > 100 chars", async () => {
        expect(
            validator.validatePartyName(`
        this description is > 100 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `),
        ).toBe("Too long, >100 characters");
    });

    test("should fail on null PartyName", async () => {
        expect(validator.validatePartyName(null)).toBe("No value provided");
    });

    test("should fail on undefined PartyName", async () => {
        let summ;
        expect(validator.validatePartyName(summ)).toBe("No value provided");
    });
});

describe("short party name validator", () => {
    test("should pass on valid name", async () => {
        expect(validator.validateShortName("12345")).toBe(null);
    });
    test("should fail on invalid ShortName - > 5 chars", async () => {
        expect(
            validator.validateShortName(`
        this description is > 5 chars long 
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
        asdlfkjaslkdjflsdjlkflsdlkjflsdlkjsdfadlkjfslakjdfkljsadfsadfaslkfasdfasdfasdfsadfjkflsdl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
sdflsdlfkjasjlkdflsdflslsdfljasdfasdlkfjas
adflkjasldkjflsdflsldkjflsdflsl
            `),
        ).toBe("Too long, >5 characters");
    });

    test("should fail on null ShortName", async () => {
        expect(validator.validateShortName(null)).toBe("No value provided");
    });

    test("should fail on undefined ShortName", async () => {
        let summ;
        expect(validator.validateShortName(summ)).toBe("No value provided");
    });
});

describe("icon url validator", () => {
    test("should pass on valid fetch", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: (header) =>
                    header === "content-type" ? "image/png" : null,
            },
        });
        expect(await validator.validateIcon("https://image.com")).toBe(null);
    });

    test("should fail on invalid icon", async () => {
        fetch.mockResolvedValueOnce({
            ok: null,
            headers: {
                get: (header) =>
                    header === "content-type" ? "video/png" : null,
            },
        });
        expect(await validator.validateIcon("12345")).toBe(
            "Invalid URL - failed to reach",
        );
    });

    test("should fail on invalid Icon - > 2083 chars", async () => {
        expect(
            await validator.validateIcon(`
        this description is > 2083 chars long 
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            `),
        ).toBe("Too long, >2083 characters");
    });

    test("should fail on null Icon", async () => {
        expect(await validator.validateIcon(null)).toBe("No value provided");
    });

    test("should fail on undefined Icon", async () => {
        let summ;
        expect(await validator.validateIcon(summ)).toBe("No value provided");
    });
});

describe("PartyColor validator", () => {
    test("should pass for valid color", async () => {
        expect(validator.validateColor("#FFFFFF")).toBe(null);
    });

    test("should fail for invalid color", async () => {
        expect(validator.validateColor("red")).toBe(
            "Not a valid hex color code",
        );
    });

    test("should fail for invalid color", async () => {
        expect(validator.validateColor("rgb(0,0,0,)")).toBe(
            "Not a valid hex color code",
        );
    });

    test("should fail for null", async () => {
        expect(validator.validateColor(null)).toBe("No value provided");
    });

    test("should fail for undefined", async () => {
        let col;
        expect(validator.validateColor(col)).toBe("No value provided");
    });
});

describe("Reason validator", () => {
    test("should pass for valid Reason", async () => {
        expect(validator.validateReason("Cos i want it")).toBe(null);
    });

    test("should fail for reason > 1000chars long", async () => {
        expect(
            validator.validateReason(`
According to all known lawsof aviation,there is no way a beeshould be able to fly.Its wings are too small to getits fat little body off the ground.The bee, of course, flies anywaybecause bees don't carewhat humans think is impossible.Yellow, black. Yellow, black.Yellow, black. Yellow, black.Ooh, black and yellow!Let's shake it up a little.Barry! Breakfast is ready!Coming!Hang on a second.Hello?- Barry?- Adam?- Can you believe this is happening?- I can't. I'll pick you up.Looking sharp.Use the stairs. Your fatherpaid good money for those.Sorry. I'm excited.Here's the graduate.We're very proud of you, son.A perfect report card, all B's.Very proud.Ma! I got a thing going here.- You got lint on your fuzz.- Ow! That's me!- Wave to us! We'll be in row 118,000.- Bye!Barry, I told you,stop flying in the house!- Hey, Adam.- Hey, Barry.- Is that fuzz gel?- A little. Special day, graduation.Never thought I'd make it.Three days grade school,three days high school.Those were awkward.Three days college. I'm glad I tooka day and hitchhiked around the hive.
            `),
        ).toBe("Too long, >1000 characters");
    });

    test("should fail for null", async () => {
        expect(validator.validateReason(null)).toBe("No value provided");
    });

    test("should fail for undefined", async () => {
        let col;
        expect(validator.validateReason(col)).toBe("No value provided");
    });
});
