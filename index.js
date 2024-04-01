const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n3vft3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const volunteersCollection = client.db('volunteerNetwork').collection('volunteers');
        const usersCollection = client.db('volunteerNetwork').collection('users');
        const eventsCollection = client.db('volunteerNetwork').collection('events');

        // volunteer service related api
        app.get('/volunteers', async (req, res) => {
            const search = req.query.search;
            let cursor;

            if (search) {
                cursor = volunteersCollection.find({ title: { $regex: search, $options: 'i' } });
            }
            else {
                cursor = volunteersCollection.find();
            }

            const result = await cursor.toArray();
            res.send(result);
        });


        // users related api
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            const result = await usersCollection.insertOne(userInfo);
            res.send(result);
        });


        // event program related api
        app.post('/events', async (req, res) => {
            const eventInfo = req.body;
            const query = {
                title: eventInfo.title,
                email: eventInfo.email
            };

            const existingEvent = await eventsCollection.findOne(query);
            if (existingEvent) {
                return res.send({ message: 'This event program has already been added.' });
            }
            else {
                const result = await eventsCollection.insertOne(eventInfo);
                return res.send(result);
            }
        });

        app.get('/events', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await eventsCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await eventsCollection.deleteOne(query);
            res.send(result);
        });



    }
    finally {
    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Volunteer Network server running!!')
});

app.listen(port, () => {
    console.log(`Volunteer network app listening on port ${port}`)
});