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
    const employeeCollection = client.db("sayem").collection("employees");
    const formCollection = client.db("sayem").collection("form");

    // Employee CRUD Operations

    // 1. GET all employees (READ)
    app.get("/employees", async (req, res) => {
      const employees = await employeeCollection.find().toArray();
      res.send(employees);
    });

    // 2. POST new employee (CREATE)
    app.post("/employees", async (req, res) => {
      const employee = req.body;
      const result = await employeeCollection.insertOne(employee);
      res.status(201).send(result);
    });

    // 3. PUT update existing employee by ID (UPDATE)
    app.put("/employees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedEmployee = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedEmployee,
      };
      const result = await employeeCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // 4. DELETE employee by ID (DELETE)
    app.delete("/employees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await employeeCollection.deleteOne(query);
      res.send(result);
    });

    // Form Handling

    // 1. GET all form entries (READ)
    app.get("/form", async (req, res) => {
      const forms = await formCollection.find().toArray();
      res.send(forms);
    });

    // 2. POST new form entry (CREATE)
    app.post("/form", async (req, res) => {
      const formData = req.body;
      const result = await formCollection.insertOne(formData);
      res.status(201).send(result);
    });

  } finally {
    // Optionally close the client
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
