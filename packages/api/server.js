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
        accessKeyId: 'b@dpass', 
        secretAccessKey: 'r3alb@dpass'
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
         "servings" : JSON.parse(req.body.servings),
         "vegetarian": req.body.vegetarian,
         "vegan": req.body.vegan,
         "gluten_free": req.body.gluten_free,
         "volunteer_name": req.body.volunteer_name,
         "volunteer_phone": req.body.volunteer_phone,
         "volunteer_email": req.body.volunteer_email
        }}}, //$push
        function(err,resu){
            if (err)
                console.log(err,"Event Not Added")
            else{
                if(resu.result.nModified == 1){
                    console.log("Event Modified -- Added New Submission")
                    collection = client.db("volunteer_info").collection("volunteers")
                    collection.updateOne(
                        {"volunteer_email" : req.body.volunteer_email},
                        {$set: {"volunteer_email" : req.body.volunteer_email,
                                "volunteer_name" : req.body.volunteer_name,
                                "volunteer_phone" : req.body.volunteer_phone}},
                        {upsert : true},
                        function(err, result){
                            if(err)
                                console.log(err, "Volunteer Not Updated")
                            else{
                                console.log("Volunteer Added or Updated")
                                res.send("All Collections Updated")
                            }
                        }
                    )
                }else{
                    console.log("Error: Event Not Updated -- No matching date or type found -- Volunteer also not updated")
                    res.send("No Collections Updated")
                }
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
app.get('/api/volunteerInformation', (req, res) => {
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
       eventObj.gluten_free = sub.gluten_free
       eventObj.name = sub.volunteer_name
       eventObj.phone = sub.volunteer_phone
       eventObj.email = sub.volunteer_email
       response_data.push(eventObj)
     })
  })

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
            })
            i++
        })
        res.send({
            status: 'SUCCESS',
            event_info: JSON.stringify(response_data)
        })
    })
})
