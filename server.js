const dotenv = require('dotenv').config()
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      cookie = require("cookie-session"),
      handlebars = require("express-handlebars").engine,
      app = express()

      app.use(express.urlencoded({ extended: true }));
      app.engine("handlebars", handlebars());
      app.set("view engine", "handlebars");
      app.set("views", "./views");
      
      app.use( cookie({
          name: "session",
          keys: ["key1", "key2"],
        })
      );

app.use(express.static("public") )
app.use(express.json() )
  
const uri = `mongodb+srv://arayah:Shadow2416@cluster0.h7qss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient( uri )

let collection = null

let shows = {};

let users = {};

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  await pull_from_db();
}

run()

// middleware
app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

// route to get all docs
app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })

// route to add obj to database
app.post( '/add', async (req,res) => {
    const result = await collection.insertOne( req.body )
    res.json( result )
  })

// route to delte/remove obj from database
// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
    const result = await collection.deleteOne({ 
      _id:new ObjectId( req.body._id ) 
    })
    res.json( result )
  })

// route to update obj in database
app.post( '/update', async (req,res) => {
    const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
  
    res.json( result )
  })  

// route to login  
app.post("/login", async (req, res) => {
    const verify = await collection.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    
    user = req.body.username;
    pass = req.body.password;
    
    req.session.login = true;
    res.redirect("index.html");
  });

async function pull_from_db() {
  let userdata = await collection.findOne({type: "server_users"});
  let showdata = await collection.findOne({type: "server_shows"});

  users = userdata.data;
  shows = showdata.data;
}

async function push_to_db() {
  await collection.updateOne({type: "server_users"}, { $set: {data: users} })
  await collection.updateOne({type: "server_shows"}, { $set: {data: shows} })
}

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
    res.redirect("index.html");
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

    res.redirect("index.html");
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

// route to logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.log(err);
          return res.status(500).send("Could not log out.");
      }
      res.redirect("index.html"); // redirect to ?
  });
});
  
  app.get("/", (req, res) => {
    res.render("main", { msg: "", layout: false });
  });
  
  app.use(function (req, res, next) {
    if (req.session.login === true) next();  
  
  });
  
  app.get("/index.html", (req, res) => {
    res.render("index", { msg: "success you have logged in", layout: false });
  });

//app.listen(3000)
app.listen( process.env.PORT || 3000 );