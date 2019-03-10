const config = require('./config')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const retry = require('promise-retry')
const app = express()
const port = process.env.PORT || 5000
const uri = config.mongodbURL

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Get request to S3 container to get photos
app.get('/api/getImages', (req,res) => {
    // Currently hardcoding keys -> will figure out a better way
    const s3 = new AWS.S3({accessKeyId: 'b@dpass', secretAccessKey: 'r3alb@dpass'});
    const params = { 
        Bucket: 'beautiful-portland-carousel-photos',
        Key: 'localhost:9001/'
    }
    s3.getObject(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else     console.log(data);           
    })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Catch frondend POST request
app.post('/api/form', (req, res) => {
    console.log('Whole object: ')
    console.log(req.body)
    console.log('\nDate: ')
    console.log(req.body.param.date)
    console.log('\nBody: ')
    console.log(req.body.param.body)
    res.send({
        status: 'SUCCESS'
    })
})

// SELECT * FROM volunteers WHERE first = "Alexamder"
const test = function(db, callback) {
    const database = db.db("beautiful-portland")
    const collection = database.collection("volunteers")
    const query = {"first": "Alexander"}
    collection.find(query).toArray(function(err,docs) {
        if(err) {
            console.log(err, "Test Failed!")
            return
        }
        console.log("Documents: \n", docs)
    })
}

// Console.log to show Mongodb is connected, call test function
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err, db) => {
    if (err) {
	console.log(err, "Connection Failed")
	return
    }
    test(client, function(){
        db.close()
    })
    console.log("Connection Seccess!\n")
})
