CREATE TABLE "Issue" (
    "IssueID" serial,
    "Description" varchar(300),
    "Summary" varchar(50),
    PRIMARY KEY ("IssueID")
);

CREATE TABLE "Party" (
    "PartyID" serial,
    "Name" varchar(100),
    "ShortName" varchar(5),
    "Icon" varchar(2083),
    PRIMARY KEY ("PartyID")
);

CREATE TABLE "Stance" (
    "StanceID" serial,
    "Stand" boolean,
    "Reason" varchar(1000),
    "IssueID" int,
    "PartyID" int,
    PRIMARY KEY ("StanceID"),
    FOREIGN KEY ("IssueID") REFERENCES "Issue"("IssueID"),
    FOREIGN KEY ("PartyID") REFERENCES "Party"("PartyID")
);
