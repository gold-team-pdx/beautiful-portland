//Route returns privileged volunteer info only when admin is logged in.
//Returns array of objects for all logged volunteer info for given date.
//NOTE: THIS IS WORK IN PROGRESS. NO LOGIN CHECK UNTIL PASSPORT SET UP.
getFullEventInfo = function(req, res) {
    let client = this.dbClient
    collection = client.db("events-form").collection("events")
    collection.find({date: req.query.date}, {projection:{ _id: 0, location: 0}}).toArray((err, docs) => {
       if(err) {
         console.log(err, "Error trying to find document")
         res.send({
           status: 'FAILURE'
         })
         return
       } else if(docs[0] == null) {
         console.log("Couldn't fulfill document request")
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
}

// Method to retrieve list of all volunteers.
// Returns array of objects for volunteer name, email, and phone number.
// NOTE: THIS IS WORK IN PROGRESS. NO LOGIN CHECK UNTIL PASSPORT SET UP.
getVolunteerList = function(req, res) {
    let client = this.dbClient
    collection = client.db("volunteer_info").collection("volunteers")
    collection.find({}, {projection: {_id: 0}}).toArray((err, docs) => {
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
        docs.map(volunteer => {
             var volunteerObj = new Object()
             volunteerObj.name = volunteer.volunteer_name
             volunteerObj.phone = volunteer.volunteer_phone
             volunteerObj.email = volunteer.volunteer_email
             response_data.push(volunteerObj)
         })
        res.send({
          status: 'SUCCESS',
          volunteer_info: JSON.stringify(response_data)
        })
    })
}

updateEvent = function(req, res) {
    client = this.dbClient
    collection = client.db("events-form").collection("events")

    let updatedEvent = new Object()
    updatedEvent.date = req.body.date
    updatedEvent.time = req.body.time
    updatedEvent.coordinator = req.body.coordinator
    updatedEvent.coordinator_phone = req.body.coordinator_phone
    updatedEvent.location = req.body.location
    updatedEvent.max_servings = req.body.max_servings
    updatedEvent.categories = []
    let i = 0
    req.body.categories.forEach(category => {
        updatedEvent.categories.push({
            name: category.name,
            max_signups: category.max_signups,
            min_servings: category.min_servings,
            min_vegan: category.min_vegan,
            food: category.food,
            submissions: []
        })
        category.submissions.forEach(sub => {
            if (!sub.marked_for_deletion) {
                updatedEvent.categories[i].submissions.push({
                    description: sub.description,
                    servings: sub.servings,
                    vegetarian: sub.vegetarian,
                    vegan: sub.vegan,
                    gluten_free: sub.gluten_free,
                    volunteer_name: sub.volunteer_name,
                    volunteer_email: sub.volunteer_email,
                    volunteer_phone: sub.volunteer_phone
                })
            }
        })
        i++
    })

    collection.findOneAndReplace({date: req.body.date}, updatedEvent, (err, doc) => {
        if(err) {
            console.log(err, "Error trying to find or update event ")
            res.send({
                status: 'FAILURE'
            })
            return
        } else if( doc.value === null) {
            console.log("Couldn't find event to update")
            res.send({
                status: 'FAILURE'
            })
            return
        } else {
            console.log("Event updated")
            res.send({
                status: 'SUCCESS'
            })
            return
        }
    })
}

deleteEvent = function(req, res) {
    client = this.dbClient
    collection = client.db("events-form").collection("events")
    collection.findOneAndDelete({date: req.body.date}, (err, doc) => {
       if(err) {
         console.log(err, "Error trying to find event to delete")
         res.send({
           status: 'FAILURE'
         })
         return
       } else if (doc.value === null) {
           console.log("No event to delete with that date")
           res.send({
               status: 'FAILURE'
           })
        } else {
         console.log("Event deleted")
         res.send({
           status: 'SUCCESS'
         })
         return
       }
  })
}

// Adds files to s3 bucket using filenames from user
addPhotos = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  let file = req.body.filesToAdd
  let buf = new Buffer(file.fileData.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  const bucket = 'beautiful-portland-carousel-photos'
  if(req.body.isFrontPage === true) {
    file.fileName = 'frontPage/' + file.fileName
  }
  const params = {
    Bucket: bucket, 
    Key: file.fileName,
    Body: buf
  }
  s3.upload(params, function(s3Err, data) {
    if (s3Err) throw s3Err
    console.log('File uploaded successfully')
    res.send("upload successful")
  })
}

// Removes multiple photos from s3 bucket using filesnames from urls.
removePhotos = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  const bucket = 'beautiful-portland-carousel-photos'
  // Get presigned url and parse for file name
  const urls = req.body.urlsToRemove
  let files = []
  urls.forEach(url => {
    let file = url.split('/').pop().split('?').splice(0, 1).toString()
    if(req.body.isFrontPage === true) {
      files.push({Key: '/frontPage/' + file})
    }
    else {
      files.push({Key: file});
    }
  })
  //const url = req.body.urlToRemove
  const params = {
    Bucket: bucket,
    Delete: {
      Objects: files
    }
  }
  try {
      s3.headObject(params).promise()
      console.log("File Found in S3")
      try {
          s3.deleteObjects(params).promise()
          console.log("file deleted Successfully")
      }
      catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err))
      }
  } catch (err) {
          console.log("File not Found ERROR : " + err.code)
  }
}

addNewDraft = function(req, res) {
  let client = this.dbClient
  collection = client.db("stories_example1").collection("drafts")
  collection.updateOne(
  { "edited_timestamp" : req.body.edited_timestamp },
  { $set : {
       "edited_timestamp" : new Date(),
       "publish_status" : req.body.publishedStatus,
       "title" : req.body.title,
       "hook" : req.body.subtitle,
       "content" : req.body.content,
  }},
  { upsert : true },
   function(err,obj) {
     if(err)
       throw err
     else
       res.end("Draft Saved")
   }
  )
}

addNewPublished = function(req, res) {
  let client = this.dbClient
  collection = client.db("stories_example1").collection("published")
  collection.updateOne(
    { "edited_timestamp" : req.body.edited_timestamp },
    { $set: {
        "edited_timestamp" : new Date(),
        "publish_status" : req.body.publishedStatus,
        "title" : req.body.title,
        "hook" : req.body.subtitle,
        "content" : req.body.content
    }},
    { upsert : true },
    function(err,obj) {
      if(err)
        throw err
      else
        res.end("Story Published")
    }
  )
}

module.exports.addPhotos = addPhotos
module.exports.removePhotos = removePhotos
module.exports.getFullEventInfo = getFullEventInfo
module.exports.getVolunteerList = getVolunteerList
module.exports.updateEvent = updateEvent
module.exports.deleteEvent = deleteEvent
module.exports.addNewDraft = addNewDraft
module.exports.addNewPublished = addNewPublished