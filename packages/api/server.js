const config = require('./config')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = process.env.PORT || 5000
const uri = config.mongodbURL

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Practice GET request to test server
app.get('/beautifulportland', (req,res) => {
    res.send({express: "The force is strong with this team..."})
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
