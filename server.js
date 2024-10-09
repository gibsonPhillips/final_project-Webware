const express = require("express");
const cookie = require("cookie-session");
const path = require("path");


async function pull_from_db() {
  // TODO IMPL
}

async function push_to_db() {
  // TODO IMPL
}

let shows = {
  "show_title": { "date": 'mmddyyyy', "time": '00:00', "description": 'desc' }
};

let users = {
  "username": { "password": 'password123', "first_name": 'first_name', "last_name": 'last_name', "email": 'email@wpi.edu', "id": '000000000', "followed_by": [], "inbox": [], "owned_events": ["show_title"] }
};

app = express();

app.use(
    cookie({
      name: "session",
      keys: ["verysecurekey(noitsnot)", "itssupersecureipromise"],
    })
);

app.use(express.static("./public"));

app.post("/follow", async function (req, res) {

  let payload = ''
  req.on('data', function( data ) {
    payload += data 
  })

  req.on('end', async function () {
    // Look I know this is horrible... its late and I am speedrunning I am sorry ;-;
    payload = JSON.parse(payload);
    if(req.session.login) {
      await pull_from_db()
      if(Object.hasOwn(users, payload.username)) {
        if(!(req.session.username in users[payload.username].followed_by)) {
          users[payload.username].followed_by.push(req.session.username);
          await push_to_db()
        }
      }
    }

    res.end();
  });
});

app.post("/fetch_inbox", async function (req, res) {
  await pull_from_db();
  res.json({"inbox": users[req.session.username].inbox});
});

app.post("/fetch_shows", async function (req, res) {
  await pull_from_db();
  res.json(shows);
});

app.post("/fetch_users", async function (req, res) {

  await pull_from_db();

  let usernames = []
  for(let user in users) {
    usernames.push(user);
  }

  res.json({"usernames": usernames});
});

app.post("/register_request", async function (req, res) {
  
  let payload = ''
  req.on('data', function( data ) {
    payload += data 
  })

  req.on('end', async function () {
    payload = JSON.parse(payload);
    await pull_from_db()
    if(!Object.hasOwn(users, payload.username)) {
      users[payload.username] = {
        "password": payload.password,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "email": payload.email,
        "id": payload.id,
        "followed_by": [], 
        "inbox": [], 
        "owned_events": []
      }
      await push_to_db()
    } else {
      // TODO respond with error
    }

    // TODO update database
    res.end();
  });
});

app.post("/request_show", async function (req, res) {
 
  let payload = ''
  req.on('data', function( data ) {
    payload += data 
  });

  req.on('end', async function () {
    payload = JSON.parse(payload);
    await pull_from_db()
    if(!Object.hasOwn(shows, payload.title)) {
      shows[payload.title] = {
        "date": payload.date,
        "time": payload.time,
        "description": payload.description
      };

      users[req.session.username].owned_events.push(payload.title);

      for(let user of users[req.session.username].followed_by) {
        users[user].inbox.push({
          "host": req.session.username,
          "title": payload.title,
        });
      }
      await push_to_db()
    }

    res.end();
  });
});

app.post("/login_request", async function (req, res) {
  let payload = ''
  req.on('data', function( data ) {
    payload += data 
  });

  req.on('end', async function () {
    payload = JSON.parse(payload)
    
    await pull_from_db()
    
    if(req.session.login) {
      req.session.login = false;
    } else {
      if(Object.hasOwn(users, payload.username) && payload.password === users[payload.username].password) 
      {
        console.log("Worked!");
        req.session.login = true;
        req.session.username = payload.username;
      }
    }
        
    res.redirect("index.html");
  });
});

app.post("/request_access", async function (req, res) {
  if(req.session.login) {
    res.end();
  } else {
    res.redirect("/views/requireLogin.html");
  }  
});

app.use(express.json())

app.listen(3000)