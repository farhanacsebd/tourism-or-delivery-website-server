const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');

require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cu5az.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("travelTourism");
        const servicesCollection = database.collection("services");
        const usersCollection = database.collection("users");


        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // post api service
        app.post('/services', async (req, res) => {

            const service = req.body;

            console.log('hit the post api', service);

            // res.send('post hitted');

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // post api user

        app.post('/users', async (req, res) => {

            const user = req.body;
            console.log('hit the post users api', user);
            // res.send('post hitted');
            const answer = await usersCollection.insertOne(user);
            console.log(answer);
            res.json(answer)
        });

        // get api user
        app.get('/users', async (req, res) => {
            const user = usersCollection.find({});
            const getUser = await user.toArray();
            res.send(getUser);
        });


        // approved the status
        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: data,
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello my World!')
})

app.listen(port, () => {
    console.log("Running my port", port)
})