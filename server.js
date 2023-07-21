//console.log("this is jamie")

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connectionString = process.env.credentials
const PORT = 8000
console.log(process.env);


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('Robin-Williams-Quotes')
    const quotesCollection = db.collection('quotes')

        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        //below is what youre getting back
        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results =>{
                    console.log(results)
                    res.render('index.ejs', {quotes: results})
                })
                .catch(error => console.error(error))
                
        })


        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                res.redirect('/')
        })
            .catch(error => console.error(error))
                console.log(req.body)
            })

            app.put('/quotes', (req, res) => {
                quotesCollection.findOneAndUpdate(
                  { name: 'Robin Williams' },
                  {
                    $set: {
                      name: req.body.name,
                      quote: req.body.quote
                    }
                  },
                  {
                    upsert: true
                  }
                )
                  .then(result => res.json('Success'))
                  .catch(error => console.error(error))
              })   
 
              app.delete('/quotes', (req, res) => {
                quotesCollection.deleteOne(
                  { name: req.body.name }
                )
                  .then(result => {
                    if (result.deletedCount === 0) {
                      return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vadar\'s quote')
                  })
                  .catch(error => console.error(error))
              })
              connectDB().then(() => {
        app.listen(process.env.PORT || PORT, function () {
            console.log('listening on 8000')
        })
      }
  })
  .catch(error => console.error(error))

