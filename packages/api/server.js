const config = require('./config')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const app = express()
const port = process.env.PORT || 5000
const uri = config.mongodbURL

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Get request to S3 container to get photos for image carousel
app.get('/api/getImages', (req,res) => {
    const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint('http://localhost:9001'),
        s3ForcePathStyle: true,
        accessKeyId: process.env.MINIO_ACCESS_KEY, 
        secretAccessKey: process.env.MINIO_SECRET_KEY
    })
    const bucket = 'beautiful-portland-carousel-photos'
    const expiration = 60 * 60
    let imageUrls = []
    let data = s3.listObjects({Bucket:bucket}).promise()
        data.then(data => {
            data.Contents.forEach((item) => {
                let key = item.Key
                imageUrls = imageUrls.concat(s3.getSignedUrl('getObject', {
                    Bucket: bucket,
                    Key: key,
                    Expires: expiration
                }))
            })
            res.send(imageUrls)
        })
        .catch(err => {
            console.log(err)
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
