//Route returns privileged volunteer info only when admin is logged in.
//Returns array of objects for all logged volunteer info for given date.
//NOTE: THIS IS WORK IN PROGRESS. NO LOGIN CHECK UNTIL PASSPORT SET UP.
getFullEventInfo = function(req, res) {
    let client = this.dbClient
    collection = client.db("events-form").collection("events")
    collection.find({date: req.query.date}, {projection:{ _id: 0}}).toArray((err, docs) => {
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
          event_info: JSON.stringify(response_data),
          location: docs[0].location,
          coordinator: docs[0].coordinator,
          coordinator_phone: docs[0].coordinator_phone,
          max_servings: docs[0].max_servings
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
  let response_data = []
  let updatedEvent = new Object()
  updatedEvent.date = req.body.date
  //updatedEvent.time = req.body.time
  updatedEvent.coordinator = req.body.coordinator
  updatedEvent.coordinator_phone = req.body.coordinator_phone
  updatedEvent.location = req.body.location
  //updatedEvent.max_servings = req.body.max_servings
  updatedEvent.categories = []

  // Get old document to get category info
  collection.find({date: req.body.date}, {projection:{ _id: 0}}).toArray((err, docs) => {
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
    updatedEvent.time = docs[0].time
    updatedEvent.max_servings = docs[0].max_servings
    docs[0].categories.forEach(category => {
      updatedEvent.categories.push({
          name: category.name,
          max_signups: category.max_signups,
          min_servings: category.min_servings,
          min_vegan: category.min_vegan,
          food: category.food,
          submissions: []
      })
     })
    
    // Load in submissions that came in from front end
    for(var sub of req.body.submissions) {
      if (!sub.marked_for_deletion) {
        let cat = updatedEvent.categories.find((elem) => {return elem.name === sub.type})
        cat.submissions.push({
            description: sub.desc,
            servings: sub.servings,
            vegetarian: sub.vegetarian,
            vegan: sub.vegan,
            gluten_free: sub.gluten_free,
            volunteer_name: sub.name,
            volunteer_email: sub.phone,
            volunteer_phone: sub.email
        })
      }
    }

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

module.exports.getFullEventInfo = getFullEventInfo
module.exports.getVolunteerList = getVolunteerList
module.exports.updateEvent = updateEvent
module.exports.deleteEvent = deleteEvent
module.exports.addNewDraft = addNewDraft
module.exports.addNewPublished = addNewPublished