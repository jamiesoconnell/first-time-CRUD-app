require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 8000;
const connectionString = process.env.MONGODB_CONNECTION_STRING;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    console.log('Connected to Database');
    const db = client.db('Robin-Williams-Quotes');
    const quotesCollection = db.collection('quotes');

    app.get('/', async (req, res) => {
      try {
        const results = await quotesCollection.find().toArray();
        console.log(results);
        res.render('index.ejs', { quotes: results });
      } catch (error) {
        console.error(error);
      }
    });

    app.post('/quotes', async (req, res) => {
      try {
        const result = await quotesCollection.insertOne(req.body);
        res.redirect('/');
      } catch (error) {
        console.error(error);
      }
      console.log(req.body);
    });

    app.put('/quotes', async (req, res) => {
      try {
        const result = await quotesCollection.findOneAndUpdate(
          { name: 'Robin Williams' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        );
        res.json('Success');
      } catch (error) {
        console.error(error);
      }
    });

    app.delete('/quotes', async (req, res) => {
      try {
        const result = await quotesCollection.deleteOne({ name: req.body.name });
        if (result.deletedCount === 0) {
          return res.json('No quote to delete');
        }
        res.json('Deleted quote');
      } catch (error) {
        console.error(error);
      }
    });

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });

  } catch (error) {
    console.error(error);
  }
}

connectToDatabase();
