# WWPI Radio Club
### Team Members
- Abbey Kratman
- April Bollinger
- Arayah Remillard
- Gibson Phillips
- Jonathan Asher

[https://finalproject-group1.glitch.me/](https://finalproject-group1.glitch.me/)

## Project Description
Our goal was to create a dynamic website to serve as a proof of concept for the WPI on-campus Amateur Radio Club. The WPII radio club hosts weekly shows and various on-campus activites beyond what the current site shows. The current [WWPI website](https://wwpiradioexecs.wixsite.com/wwpi) is depreciated and lacks some functionality that we implemented.

Our website allows for the creation of user accounts to personalize user experiences. A user can view the services the WWPI club provides, book an event, request to have their own show, view member training information, view other users and follow them, view published events, and access inbox messages.

## User Instructions
A user must register for or login in to there account to see a lot of information or use the forms.

## Technologies
- Cookies - implemented cookies to allow users to log on and stay logged on for the session
- Express - implemented express to help handle the server side JS
- Express-handlebars - implemented for login pages
- Mongodb - User information (username, password, name, email, inbox, id, followers, owned events) and shows (show title, host, date, time, description)
- HTML - Structure of pages
- CSS - Styling of pages
- JS - Used for dynamic behavior and client/server interactions
- Fontawesome - Icons to link to the clubs social media accounts
- Github - code organization and collaboration
- Glitch - final deployment of project

## Challenges
- Importing and using fontawesome icons
- Dynamic Inbox - Using the DB for the dynamic inbox makes the DB weak against race conditions (multiple users)
- Addressing Accessibility concerns using color contrast and HTML for screen readers
- Using MongoDB to allow for followers
- File Organization - We have a lot of files with different fuctionality
- Used CRAP design principles - used contrast to ensure our elements stand out from each other, repition on similar elements, alignment to relate elements visually, and kept related content within close proximity of each other.


## Team Contributions
**Abbey Kratman**
- CSS and reformating
- Recorded, edited, and posted demonstration video
- Used color contrast and html to increase accessibility

**April Bollinger**
- Structural HTML
- Package.json
- Icons, Links and video embedding
- Deployment

**Arayah Remillard**
- Implemented Mongodb
- Implemented Express and handlebars
- Cookies

**Gibson Phillips**
- Found the hosting site
- Format planning
- CSS

**Jonathan Asher**
- Cookies
- Login Authorization
- Client/server side JS for forms, following users, and inbox alerts

## Project Demonstration
[Project Demonstration Video](https://youtu.be/tNNE-Ki4Qic)


