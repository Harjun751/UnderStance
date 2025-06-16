-- Insert Party
INSERT INTO "Party" ("Name", "ShortName", "Icon", "PartyColor")
VALUES ('Coalition for Shakira', 'CFS', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FnsIzrgTUb6sAAAAC%2Fmonday-left-me-broken-cat.gif&f=1&nofb=1&ipt=037bc199f0a9705f2ffda49a41302c4a674c8d69748df626cd8e70491f1f379d', '#FFD700');

INSERT INTO "Party" ("Name", "ShortName", "Icon", "PartyColor")
VALUES ('Traditionalists'' Party', 'TP', 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f', '1E90FF');

-- Issue 1: Changer national anthem to hips's don't lie
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Change national anthem to hip''s don''t lie', 'On the anthem', 'National Identity');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (1, 1, true, 'It''s a certified bop');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (1, 2, false, 'The current one is good enough TBH');

-- Issue 2: Introduce compulsory rhythm classes in Parliament
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Mandate weekly rhythm & dance classes for MPs', 'On political grace', 'Governance');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (2, 1, true, 'A leader who can groove can govern!');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (2, 2, false, 'MPs should be debating, not doing the Macarena');

-- Issue 3: Rename "National Day Rally" to "Shake it Summit"
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Rename National Day Rally to Shake it Summit', 'On national branding', 'National Identity');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (3, 1, true, 'Catchy names get more engagement');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (3, 2, false, 'Respect the dignity of national addresses');

-- Issue 4: Tax incentives for Spotify streams of Shakira songs
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Tax breaks for streaming Shakira''s hits', 'On cultural subsidies', 'Cultural Policy');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (4, 1, true, 'Support global icons who support hip mobility');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (4, 2, false, 'We''re not funding your reggaeton playlist');

-- Issue 5: Ban politicians from lying, unless their hips do too
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Ban lying in politics—hips must also not lie', 'On political integrity', 'Governance');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (5, 1, true, 'Truth starts from the hips upward');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (5, 2, true, 'Lying is bad. Full stop.');

-- Issue 6: Government to produce annual interpretive dance budget summary
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Use interpretive dance to explain the national budget', 'On fiscal transparency', 'Public Engagement');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (6, 1, true, 'Numbers speak louder when danced');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (6, 2, false, 'We prefer spreadsheets over salsa');

-- Issue 7: Ministry of Groove to replace Ministry of Culture
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Replace Ministry of Culture with Ministry of Groove', 'On cultural priorities', 'Cultural Policy');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (7, 1, true, 'Culture is dead. Long live the groove!');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (7, 2, false, 'Our culture is more than just rhythm');

-- Issue 8: National service to include salsa drills
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Include salsa dance in national service training', 'On national fitness', 'Defense');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (8, 1, true, 'Improves coordination and morale');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (8, 2, false, 'This is training, not a wedding reception');

-- Issue 9: Make Shakira’s birthday a public holiday
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Declare Shakira''s birthday a national holiday', 'On public holidays', 'Public Engagement');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (9, 1, true, 'A day off to appreciate hips and heritage');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (9, 2, false, 'How about no. We have enough holidays');

-- Issue 10: Install a dance floor in Parliament
INSERT INTO "Issue" ("Description", "Summary", "Category")
VALUES ('Install a dance floor in Parliament', 'On parliamentary renovations', 'Governance');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (10, 1, true, 'To settle debates with dance-offs');

INSERT INTO "Stance" ("IssueID", "PartyID", "Stand", "Reason")
VALUES (10, 2, false, 'It''s Parliament, not a disco hall');