INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Change national anthem to hip''s don''t lie', 'On the anthem', 'National Identity');

INSERT INTO "Party" ("Name", "ShortName", "Icon", "PartyColor")
VALUES ('Coalition for Shakira', 'CFS', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FnsIzrgTUb6sAAAAC%2Fmonday-left-me-broken-cat.gif&f=1&nofb=1&ipt=037bc199f0a9705f2ffda49a41302c4a674c8d69748df626cd8e70491f1f379d', '#FFD700');

INSERT INTO "Party" ("Name", "ShortName", "Icon", "PartyColor")
VALUES ('Traditionalists'' Party', 'TP', 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f', '#1E90FF');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (1, 1, true, 'It''s a certified bop');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (1, 2, false, 'The current one is good enough TBH');
