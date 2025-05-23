USE UnderStance;

CREATE TABLE Issue (
    IssueID int NOT NULL AUTO_INCREMENT,
    Description varchar(300),
    Summary varchar(50),
    PRIMARY KEY (IssueID)
);

CREATE TABLE Party (
    PartyID int NOT NULL AUTO_INCREMENT,
    Name varchar(100),
    ShortNames varchar(5),
    Icon blob,
    PRIMARY KEY (PartyID)
);

CREATE TABLE Stance (
    StanceID int NOT NULL AUTO_INCREMENT,
    Stand boolean,
    Reason varchar(1000),
    IssueID int,
    PartyID int,
    PRIMARY KEY (StanceID),
    FOREIGN KEY (IssueID) REFERENCES Issue(IssueID),
    FOREIGN KEY (PartyID) REFERENCES Party(PartyID)
);
