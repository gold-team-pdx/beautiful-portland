const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT || 3000
const uri = "mongodb+srv://admin:admin@beautiful-portland-db-w9xpb.mongodb.net/admin";

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Practice GET request to test server
app.get('/beautifulportland', (req,res) => {
    res.send({express: "The force is strong with this team..."})
})

// Console.log to show Mongodb is connected
MongoClient.connect(uri, { useNewUrlParser: true }, (err, db) => {
    if (err) {
	console.log(err, "Connection Failed");
	return;
    }
    console.log("Connection Seccess!");
})
