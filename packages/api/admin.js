//Route returns privileged volunteer info only when admin is logged in.
//Returns array of objects for all logged volunteer info for given date.

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

getPublishedStory = function(req, res) {
  let client = this.dbClient
  collection = client.db("stories_example1").collection("published")
  collection.find().sort({_id:-1}).limit(50).toArray((err, docs) => {
    if(err) {
      console.log(err, "Error trying to find published Stories")
      res.send({
        status: 'FAILURE'
      })
      return
    } else if(docs[0] == null) {
      console.log("Couldn't fufill Story request")
      res.send({
        status: 'FAILURE'
      })
      return
    }
    let response_data = []
    docs.map(pubStory => {
         var publishObj = new Object()
         publishObj.original_timestamp = pubStory._id.getTimestamp()
         publishObj.edited_timestamp = pubStory.edited_timestamp
         publishObj.title = pubStory.title
         publishObj.hook = pubStory.hook
         publishObj.content = pubStory.content
         publishObj.public_status = pubStory.public_status
         response_data.push(pubStory)
     })
    res.send({
      status: 'SUCCESS',
      published_info: JSON.stringify(response_data)
    })
  })
}

getDraftedStories = function(req, res) {
  let client = this.dbClient
  collection = client.db("stories_example1").collection("drafts")
  collection.find().sort({_id:-1}).limit(50).toArray((err, docs) => {
    if(err) {
      console.log(err, "Error trying to find drafted Stories")
      res.send({
        status: 'FAILURE'
      })
      return
    } else if(docs[0] == null) {
      console.log("Couldn't fufill Story request")
      res.send({
        status: 'FAILURE'
      })
      return
    }
    let response_data = []
    docs.map(draftStory => {
         var draftObj = new Object()
         draftObj.original_timestamp = draftStory._id.getTimestamp()
         draftObj.edited_timestamp = draftStory.edited_timestamp
         draftObj.title = draftStory.title
         draftObj.hook = draftStory.hook
         draftObj.content = draftStory.content
         draftObj.public_status = draftStory.public_status
         response_data.push(draftStory)
     })
    res.send({
      status: 'SUCCESS',
      draft_info: JSON.stringify(response_data)
    })
  })
}




module.exports.getFullEventInfo = getFullEventInfo
module.exports.getVolunteerList = getVolunteerList
module.exports.addNewDraft = addNewDraft
module.exports.addNewPublished = addNewPublished
module.exports.getPublishedStory = getPublishedStory
module.exports.getDraftedStories = getDraftedStories
