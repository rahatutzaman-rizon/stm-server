const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = "mongodb://rizonrahat199:gpeYJ3jTyAALnHAr@ac-jif2aos-shard-00-00.u9sh80h.mongodb.net:27017,ac-jif2aos-shard-00-01.u9sh80h.mongodb.net:27017,ac-jif2aos-shard-00-02.u9sh80h.mongodb.net:27017/?ssl=true&replicaSet=atlas-rzyffr-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const formCollection = client.db("sayem").collection("form");

    // 1. GET all form entries (READ)
    app.get("/form", async (req, res) => {
      const result = await formCollection.find().toArray();
      res.send(result);
    });

    // 2. POST new form entry (CREATE)
    app.post("/form", async (req, res) => {
      const formData = req.body;
      const result = await formCollection.insertOne(formData);
      res.status(201).send(result);
    });

    // 3. PUT update existing form entry by ID (UPDATE)
    app.put("/form/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };
      const result = await formCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // 4. DELETE form entry by ID (DELETE)
    app.delete("/form/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await formCollection.deleteOne(query);
      res.send(result);
    });

  } finally {
    // Optionally close the client
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("STM server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});