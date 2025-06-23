CREATE TABLE "Category" (
    "CategoryID" serial,
    "Name" varchar(50),
    PRIMARY KEY ("CategoryID")
);

CREATE TABLE "Issue" (
    "IssueID" serial,
    "Description" varchar(300),
    "Summary" varchar(50),
    "CategoryID" int,
    "Active" boolean DEFAULT true,
    PRIMARY KEY ("IssueID"),
    FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID")
);

CREATE TABLE "Party" (
    "PartyID" serial,
    "Name" varchar(100),
    "ShortName" varchar(5),
    "Icon" varchar(2083),
    "PartyColor" varchar(7),
    "Active" boolean DEFAULT true,
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
    FOREIGN KEY ("PartyID") REFERENCES "Party"("PartyID"),
    UNIQUE ("IssueID", "PartyID")
);
