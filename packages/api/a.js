const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Practice GET request to test server
app.get('/beautifulportland', (req,res) => {
    res.send({express: "The force is strong with this team..."})
})

const uri = "mongodb+srv://admin:admin@beautiful-portland-db-w9xpb.mongodb.net/admin";

const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
    if (err) {
	console.log(err, "Connection Failed");
	return;
    }
    console.log("Mongoose Connection Seccess!");
});

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(uri, { useNewUrlParser: true }, (err, db) => {
    if (err) {
	console.log(err, "Connection Failed");
	return;
    }
    var dbo = db.db("beautiful-portland-db-w9xpb");
    var query = { city: "Salem"};
    dbo.collection("volunteers").find(query, (err, result) => {
        console.log(result);
        db.close();
    });
   console.log("\nMongodb Connection Seccess!");
}
