//const dotenv = require('dotenv').config()

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

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
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
    console.log(req.body);
    const verify = await collection.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    
    user = req.body.username;
    pass = req.body.password;
    
    req.session.login = true;
    res.redirect("index.html");
  
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