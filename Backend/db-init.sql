CREATE DATABASE UnderStance;
USE UnderStance;

CREATE TABLE Issue (
    IssueID int,
    Description varchar(300),
    Summary varchar(50),
    PRIMARY KEY (IssueID)
);

CREATE TABLE Stance (
    StanceID int,
    Stand boolean,
    Reason varchar(1000),
    IssueID int,
    PartyID int,
    PRIMARY KEY (StanceID),
    FOREIGN KEY (IssueID) REFERENCES Issue(IssueID),
    FOREIGN KEY (PartyID) REFERENCES Party(PartyID)
);


CREATE TABLE Party (
    PartyID int,
    Name varchar(100),
    ShortNames varchar(5),
    Icon blob,
    PRIMARY KEY (PartyID)
);
