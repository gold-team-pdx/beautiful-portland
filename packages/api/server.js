const config = require('./config')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5000
const uri = config.mongodbURL

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Practice GET request to test server
app.get('/beautifulportland', (req,res) => {
    res.send({express: "The force is strong with this team..."})
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
