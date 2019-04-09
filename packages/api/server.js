const config = require('./config')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const app = express()
const port = process.env.PORT || 5000
const uri = config.mongodbURL

//Connects to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err) => {
    if (err) {
        console.log(err, "Connection to db failed")
        return
    }
})

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Get request to S3 container to get photos for image carousel
app.get('/api/getImages', (req,res) => {
    const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint('http://localhost:9001'),
        s3ForcePathStyle: true,
<<<<<<< Updated upstream
        accessKeyId: 'b@dpass', 
        secretAccessKey: 'r3alb@dpass'
=======
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY
>>>>>>> Stashed changes
    })
    const bucket = 'beautiful-portland-carousel-photos'
    let imageUrls = []
    let data = s3.listObjects({Bucket:bucket}).promise()
        data.then(data => {
            data.Contents.forEach((item) => {
                let key = item.Key
                imageUrls = imageUrls.concat(s3.getSignedUrl('getObject', {
                    Bucket: bucket,
                    Key: key,
                }))
            })
            res.send(imageUrls)
        })
        .catch(err => {
            console.log(err)
        })
})

<<<<<<< Updated upstream
=======
app.use(cookieSession({
    name: 'session',
    keys: [process.env.MINIO_ACCESS_KEY, process.env.MINIO_SECRET_KEY],
    // Cookie Options
    // Expires in 24 hours
    maxAge: 60 * 60 * 1000,
    path: '/'
  }))

>>>>>>> Stashed changes
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Catch frondend POST request
app.post('/api/form', (req, res) => {
    //updates Document in mongodb
    collection = client.db("events-form").collection("events")
    collection.updateOne(
      {$and: [{date:req.body.date}, {"categories.name":req.body.type}]},
      {$push: {"categories.$.submissions": {
         "description" : req.body.description,
         "serving" : JSON.parse(req.body.servings),
         "vegetarian": req.body.vegetarian,
         "vegan": req.body.vegan,
         "gluten_Free": req.body.glutenFree,
         "volunteer_name": req.body.volunteer_name,
         "volunteer_phone": req.body.volunteer_phone,
         "volunteer_email": req.body.volunteer_email
        }}}, //$push
        function(err,result){
            if (err)
                console.log(err,"Event Not Added")
            else{
                console.log("Added")
                res.send("Updated")
            }
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
// client.connect((err, db) => {
//     if (err) {
// 	console.log(err, "Connection Failed")
// 	return
//     }
//     test(client, function(){
//         db.close()
//     })
//     console.log("Connection Seccess!\n")
// })

//express middleware to check if admin is logged in.
function loggedIn(req, res, next) {
  if(req.user){
    next();
  } else {
    res.redirect('/');
  }
}

//Route returns privileged volunteer info only when admin is logged in.
//Returns array of objects for all logged volunteer info for given date.
//NOTE: THIS IS WORK IN PROGRESS. NO LOGIN CHECK UNTIL PASSPORT SET UP. 
app.get('/volunteerInformation', (req, res) => {
  console.log("volunteer info route");
  collection = client.db("events-form").collection("events")
  collection.find({date: req.query.date}, {projection:{ _id: 0, location: 0}}).toArray((err, docs) => {
     if(err) {
       console.log(err, "Error trying to find document")
       res.send({
         status: 'FAILURE'
       })
       return
     } else if(docs[0] == null) {
       console.log("Couldn't fufill document request")
       res.send({
         status: 'FAILURE'
       })
       return
     }

     let response_data = []
     docs[0].categories.forEach(category => {
     category.submissions.forEach(sub => {
       var eventObj = new Object()
       eventObj.type = category.name
       eventObj.desc = sub.description
       eventObj.servings = sub.servings
       eventObj.vegetarian = sub.vegetarian
       eventObj.vegan = sub.vegan
       eventObj.gluten_Free = sub.gluten_Free
       eventObj.name = sub.volunteer_name
       eventObj.phone = sub.volunteer_phone
       eventObj.email = sub.volunteer_email
       response_data.push(eventObj)
     })
  })

     //console.log(response_data)
     res.send({
         status: 'SUCCESS',
         event_info: JSON.stringify(response_data)
     })
   })
 })


app.get('/api/event?*', (req, res) => {
    collection = client.db("events-form").collection("events")
    collection.find({date: req.query.date}).toArray((err, docs) => {
        if(err) {
            console.log(err, "Error trying to find document")
            res.send({
                status: 'FAILURE'
            })
            return
        } else if(docs.length === 0) {
            console.log("Couldn't fulfill a document request")
            res.send({
                status: 'FAILURE'
            })
            return
        }

        let i = 0, response_data = []
        docs[0].categories.forEach(category => {
            response_data.push({type: category.name, servings: 0})
            category.submissions.forEach(sub => {
                response_data[i].servings += sub.servings
                console.log(sub.description)
                console.log(sub.volunteer_name)
                console.log(sub.volunteer_phone)
                console.log(sub.volunteer_email)
            })
            i++
        })
        res.send({
            status: 'SUCCESS',
            event_info: JSON.stringify(response_data)
        })
    })
})
