const dotenv = require('dotenv').config()

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

// middleware
app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

const uri = `mongodb+srv://arayah:Shadow2416@cluster0.h7qss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

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
}

run()

app.listen(3000)