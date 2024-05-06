const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware 
// const corsOptions ={
//     origin:['http://localhost:5173/'],
//     credential:true,
//     optionSuccessStatus:200,
// }
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbnjpl6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
const jobsCollection = client.db('solosphere').collection('jobs')
const bidsCollections = client.db('solosphere').collection('bids')

   
    //Get all jobs data from db
    app.get('/jobs',async(req,res)=>{
        const result = await jobsCollection.find().toArray()
        res.send(result)
    })


    //Get a single data from db using job id
    app.get('/job/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollection.findOne(query)
      res.send(result)
    })

    // save a bid data in db
    app.post('/bid',async(req,res)=>{
      const bidData = req.body;
      const result = await bidsCollections.insertOne(bidData)
      res.send(result)
    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})