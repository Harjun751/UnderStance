# Project Log
Summary: 40 hours for Arjun, 44 hours for Thaddaeus.
Time was spent on learning React, learning Github Actions, daily scrum, planning meetings and software development.
<table class="tg"><thead>
  <tr>
    <th class="tg-0pky" rowspan="2">Date</th>
    <th class="tg-0pky" colspan="2">Comments</th>
    <th class="tg-0pky" colspan="2">Estimated Hours</th>
  </tr>
  <tr>
    <th class="tg-0pky">Arjun</th>
    <th class="tg-0pky">Thaddaeus</th>
    <th class="tg-0pky">Arjun</th>
    <th class="tg-0pky">Thaddaeus</th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-0pky">20th May</td>
    <td class="tg-0pky" colspan="2">Initial Scrum Meeting. We decided to go with Scrum as the collaboration framework of this project. We did an initial meeting before starting the sprint, where we decided on which tools we were going to use to facilitate our processes. We chose to use JIRA for the backlog. We filled up the project backlog with user stories, and added the stories we intended to complete for the first sprint to the relevant area. We settled on 2 week sprints, which was perfect for the first milestone. We did a quick planning poker to set the story point estimations on the tasks that we assigned to sprint 1. We lastly settled on 15 minute daily scrums at 5pm everyday.</td>
    <td class="tg-0pky" colspan="2">4</td>
  </tr>
  <tr>
    <td class="tg-0pky" rowspan="2">21st May</td>
    <td class="tg-0pky" colspan="2">First daily scrum - While discussing we found that it was probably best to setup the docker compose files first and foremost so that our development environment would be standardized. Decided to use <a href="https://docs.github.com/en/get-started/using-github/github-flow" target="_blank" rel="noopener noreferrer">Github Flow</a> as our branching strategy</td>
    <td class="tg-0pky" colspan="2">4</td>
  </tr>
  <tr>
    <td class="tg-0pky">I created config files for the database, including the inital .sql file to initialize the tables of the database. Created an entity relationship diagram to visualize how the database would be, so that everything was logical</td>
    <td class="tg-0pky">I started learning React.</td>
    <td class="tg-0pky">3</td>
    <td class="tg-0pky">4</td>
  </tr>
  <tr>
    <td class="tg-0pky">22nd May</td>
    <td class="tg-0pky">I started creating docker compose files for the database. I spent time reading documentation to recap on the basics of Docker. I also began on the first feature of the Backend, the GET endpoint for quiz questions. I followed TDD, creating a test suite using Jest for Node.</td>
    <td class="tg-0pky">-</td>
    <td>5</td>
    <td>5</td>
  </tr>
  <tr>
    <td class="tg-0pky">23rd May</td>
    <td class="tg-0pky">Created an integration test that would spin up docker instances and then query the exposed endpoint, ensuring the correct result was outputted. With test cases done, began implementing the feature. Upon doing so, realized some issues with integration test. Particularly, setup script was not working well and the test would run before the server was ready. Fixed the issue and pushed to branch</td>
    <td class="tg-0pky">-</td>
    <td>4</td>
    <td>5</td>
  </tr>
  <tr>
    <td class="tg-0pky">24th May</td>
    <td class="tg-0pky">Continued following TDD workflow. Created first PR to main.</td>
    <td class="tg-0pky">Began first task of designing and implementing the frontend of our app.</td>
    <td>3</td>
    <td>3</td>
  </tr>
  <tr>
    <td class="tg-0pky">25th May</td>
    <td class="tg-0pky">Started on next task in backlog, setting up a GET endpoint for party stances. Created tests.</td>
    <td class="tg-0pky">Completed implementing basic front page with links to future pages. Created PR for task</td>
    <td>3</td>
    <td>3</td>
  </tr>
  <tr>
    <td class="tg-0pky">26th May</td>
    <td class="tg-0pky">Had to refine testing scripts to allow docker instances to spin up in parallel for different test suites.</td>
    <td class="tg-0pky">Began work on next task in backlog, implementing the connection to the Backend from the Frontend.</td>
    <td>2</td>
    <td>3</td>
  </tr>
  <tr>
    <td class="tg-0pky">27th May</td>
    <td class="tg-0pky">Finished up on task. Created PR. Worked on next task, endpoint for party stances. Finished up and created PR.</td>
    <td class="tg-0pky">Resolved the few remaining issues from connecting the backend to the frontend. Created PR and began next task, creating the quiz page for the application. Implemented the basic quiz structure.</td>
  </tr>
  <tr>
    <td class="tg-0pky">28th May</td>
    <td class="tg-0pky">Finished up on tasks for this sprint. Started researching on (free) hosting options.</td>
    <td class="tg-0pky">Began implementation of the read stances page. Implemented tracking of the user's answer to each question and redirect from quiz page to readstances page to display user's answer. Stored the user's answer in local storage so that they won't need to redo the quiz. Implemented basic looking visual breakdown of user's answers.</td>
    <td>1</td>
    <td>3</td>
  </tr>
  <tr>
    <td class="tg-0pky">29th May</td>
    <td class="tg-0pky"></td>
    <td class="tg-0pky"></td>
    <td>0</td>
    <td>0</td>
  </tr>
  <tr>
    <td class="tg-0pky">30th May</td>
    <td class="tg-0pky">Did code review for Thad's PR and approved changes. Migrated DB to postgres for <a href="https://github.com/Harjun751/UnderStance/issues/6" target="_blank" rel="noopener noreferrer">reasons listed in this issue</a></td>
    <td class="tg-0pky">Created PR for quiz page task. Began work on deploying the frontend, backend and database to render.</td>
    <td>3</td>
    <td>5</td>
  </tr>
  <tr>
    <td class="tg-0pky">31st May</td>
    <td class="tg-0pky">Contributed to some work for Github Actions task.</td>
    <td class="tg-0pky">Started work on Github Actions task. Finished &amp; made PR.</td>
    <td>4</td>
    <td>5</td>
  </tr>
  <tr>
    <td class="tg-0pky">1st June</td>
    <td class="tg-0pky">Done tasks for sprint. Started work on Milestone 1 submission requirements.</td>
    <td class="tg-0pky">Done tasks for sprint. Started work on Milestone 1 submission requirements.</td>
    <td>4</td>
    <td>4</td>
  </tr>
  <tr>
    <td rowspan="3">Cumulative Hours:</td>
    <td>40</td>
    <td>44</td>
  </tr>
</tbody></table>
