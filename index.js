const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // volunteer service related api
        app.get('/volunteers', async (req, res) => {
            const query = {};
            const volunteers = await volunteersCollection.find(query).toArray();
            res.send(volunteers);
        });


        // users related api
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            const result = await usersCollection.insertOne(userInfo);
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