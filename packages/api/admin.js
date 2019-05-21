//Route returns privileged volunteer info only when admin is logged in.
//Returns array of objects for all logged volunteer info for given date.

getFullEventInfo = function(req, res) {
  let client = this.dbClient
  collection = client.db('events-form').collection('events')
  collection.find({ date: req.query.date }, { projection: { _id: 0 } }).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find document')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fulfill document request')
      res.send({
        status: 'FAILURE'
      })
      return
    }

    let response_data = []
    docs[0].categories.forEach((category) => {
      category.submissions.forEach((sub) => {
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
      max_servings: docs[0].max_servings,
      date: docs[0].date,
      time: docs[0].time
    })
  })
}

// Method to retrieve list of all volunteers.
// Returns array of objects for volunteer name, email, and phone number.

getVolunteerList = function(req, res) {
  let client = this.dbClient
  collection = client.db('volunteer_info').collection('volunteers')
  collection.find({}, { projection: { _id: 0 } }).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find document')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fufill document request')
      res.send({
        status: 'FAILURE'
      })
      return
    }
    let response_data = []
    docs.map((volunteer) => {
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

postAddEvent = function(req, res){
  let client = this.dbClient
  collection = client.db('events-form').collection('events')
  collection.find({date: 'MASTER'}).toArray((err,docs) =>{
    if(err){
      console.log(err, 'Coudln\'t find MASTER document')
      res.send({
        status: 'FAILURE'
      })
    }else if(docs[0] == null){
      console.log(err, 'Couldn\'t fulfill document request')
      res.send({
        status: 'FAILURE'
      })
    }else{
 	    docs[0]._id = require('mongodb').ObjectId()
 	    docs[0].date = req.body.newDate
 	    docs[0].time = req.body.newTime
 	    docs[0].coordinator = req.body.newCoorName
 	    docs[0].coordinator_phone = req.body.newCoorPhone

		 	collection.insertOne(docs[0])
		 	res.send({
				 status: 'SUCCESS'
			 })
    }
  })
}

updateEvent = function(req, res) {
  client = this.dbClient
  collection = client.db('events-form').collection('events')
  let response_data = []
  let updatedEvent = new Object()
  updatedEvent.date = req.body.date
  updatedEvent.time = req.body.time
  updatedEvent.coordinator = req.body.coordinator
  updatedEvent.coordinator_phone = req.body.coordinator_phone
  updatedEvent.location = req.body.location
  //updatedEvent.max_servings = req.body.max_servings
  updatedEvent.categories = []

  // Get old document to get category info
  collection.find({ date: req.body.date }, { projection: { _id: 0 } }).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find document')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fulfill document request')
      res.send({
        status: 'FAILURE'
      })
      return
    }
    updatedEvent.max_servings = docs[0].max_servings
    docs[0].categories.forEach((category) => {
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
    for (var sub of req.body.submissions) {
      if (!sub.marked_for_deletion) {
        let cat = updatedEvent.categories.find((elem) => {
          return elem.name === sub.type
        })
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

    collection.findOneAndReplace({ date: req.body.date }, updatedEvent, (err, doc) => {
      if (err) {
        console.log(err, 'Error trying to find or update event ')
        res.send({
          status: 'FAILURE'
        })
        return
      } else if (doc.value === null) {
        console.log('Couldn\'t find event to update')
        res.send({
          status: 'FAILURE'
        })
        return
      } else {
        console.log('Event updated')
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
  collection = client.db('events-form').collection('events')
  collection.findOneAndDelete({ date: req.body.date }, (err, doc) => {
    if (err) {
      console.log(err, 'Error trying to find event to delete')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (doc.value === null) {
      console.log('No event to delete with that date')
      res.send({
        status: 'FAILURE'
      })
    } else {
      console.log('Event deleted')
      res.send({
        status: 'SUCCESS'
      })
      return
    }
  })
}

// Adds files to s3 bucket using filenames from user
// Returns a success message to front end
addPhotos = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  let file = req.body.filesToAdd
  let buf = new Buffer(file.fileData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const bucket = 'beautiful-portland-carousel-photos'
  if (req.body.isFrontPage === true) {
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
    res.send('upload successful')
  })
}

// Removes multiple photos from s3 bucket using filesnames from urls.
// Does not return anything, but console.logs success/failure
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
  urls.forEach((url) => {
    let file = url.split('/').pop().split('?').splice(0, 1).toString()
    if (req.body.isFrontPage === true) {
      files.push({ Key: '/frontPage/' + file })
    } else {
      files.push({ Key: file })
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
    console.log('File Found in S3')
    try {
      s3.deleteObjects(params).promise()
      console.log('file deleted Successfully')
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err) {
    console.log('File not Found ERROR : ' + err.code)
  }
}

// Moves photos from in s3 bucket from front page to all photos
// To do this move, copy the item first with the new key, then remove
// the item with the old key.
// Does not return anything, but console.logs success or failure.
removeImagesFromFrontPage = function(req, res) {
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
  urls.forEach((url) => {
    let newFile = url.split('/').pop().split('?').splice(0, 1).toString()
    // push old file to array to remove later
    let file = 'frontPage/' + newFile
    const params = {
      Bucket: bucket,
      CopySource: '/' + bucket + '/' + file,
      Key: newFile
    }
    let data = s3.copyObject(params).promise()
    // Now remove old files
    data.then(() => {
      console.log('file copied successfully!')
      const params2 = {
        Bucket: bucket,
        Key: file
      }
      try {
        s3.headObject(params2).promise()
        console.log('File Found in S3')
        try {
          s3.deleteObject(params2).promise()
          console.log('file deleted Successfully')
        } catch (err) {
          console.log('ERROR in file Deleting : ' + JSON.stringify(err))
        }
      } catch (err) {
        console.log('File not Found ERROR : ' + err.code)
      }
    })
  })
}

// Add a photo from the stories page 
// (only when published or saved as a draft)
addImageIntoStories = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  const bucket = 'beautiful-portland-carousel-photos'
  let file = req.body.fileToAdd
  let buf = new Buffer(file.fileData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  file.fileName = 'storyPhotos/' + file.fileName
  const params = {
    Bucket: bucket,
    Key: file.fileName,
    Body: buf
  }
  s3.upload(params, function(s3Err, data) {
    if (s3Err) throw s3Err
    console.log('File uploaded successfully')
    res.send('upload successful')
  })
}

removeImageFromStories = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  const bucket = 'beautiful-portland-carousel-photos'
  let fileToDelete = 'storyPhotos/' + req.body.fileToRemove
  console.log(fileToDelete)
  const params = {
    Bucket: bucket,
    Key: fileToDelete
  }
  try {
    s3.headObject(params).promise()
    console.log('File Found in S3')
    try {
      s3.deleteObject(params).promise()
      console.log('file deleted Successfully')
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err) {
    console.log('File not Found ERROR : ' + err.code)
  }
}

// Add photo to front page from already uploaded photos.
// To do this, we need to copy the photo from all photos
// to /frontPage, then remove the other photo to prevent
// duplicates.
// Does not return anything (S3 doesn't return anything on delete),
// but console.logs errors/success
addFromUploaded = function(req, res) {
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
  urls.forEach((url) => {
    let file = url.split('/').pop().split('?').splice(0, 1).toString()
    // push old file to array to remove later
    let newFile = 'frontPage/' + file
    const params = {
      Bucket: bucket,
      CopySource: '/' + bucket + '/' + file,
      Key: newFile
    }
    let data = s3.copyObject(params).promise()
    // Now remove the old version of the file
    data.then(() => {
      console.log('file copied successfully!')
      const params2 = {
        Bucket: bucket,
        Key: file
      }
      try {
        s3.headObject(params2).promise()
        console.log('File Found in S3')
        try {
          s3.deleteObject(params2).promise()
          console.log('file deleted Successfully')
        } catch (err) {
          console.log('ERROR in file Deleting : ' + JSON.stringify(err))
        }
      } catch (err) {
        console.log('File not Found ERROR : ' + err.code)
      }
    })
  })
}

addNewDraft = function(req, res) {
  let client = this.dbClient
  collection = client.db('stories_example1').collection('drafts')
  collection.updateOne(
    { edited_timestamp: req.body.edited_timestamp },
    {
      $set: {
        edited_timestamp: new Date(),
        publish_status: req.body.publish_status,
        title: req.body.title,
        hook: req.body.hook,
        content: req.body.content,
        postPhotoName: req.body.postPhotoName
      }
    },
    { upsert: true },
    function(err, obj) {
      if (err) throw err
      else res.end('Draft Saved')
    }
  )
}

addNewPublished = function(req, res) {
  let client = this.dbClient
  collection = client.db('stories_example1').collection('published')
  collection.updateOne(
    { edited_timestamp: req.body.edited_timestamp },
    {
      $set: {
        edited_timestamp: new Date(),
        publish_status: req.body.publish_status,
        title: req.body.title,
        hook: req.body.hook,
        content: req.body.content,
        postPhotoName: req.body.postPhotoName
      }
    },
    { upsert: true },
    function(err, obj) {
      if (err) throw err
      else res.end('Story Published')
    }
  )
}

editedStory = function(req,res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  console.log(req.body.publish_status)
  if(req.body.publish_status === true){
    collection = client.db('stories_example1').collection('published')
  } else {
    collection = client.db('stories_example1').collection('drafts')
  }
  collection.updateOne(
    {_id: ObjectId(req.body._id)},
    {
      $set: {
        edited_timestamp: new Date(),
        publish_status: req.body.publish_status,
        title: req.body.title,
        hook: req.body.hook,
        content: req.body.content,
        postPhotoName: req.body.postPhotoName
      }
    },
    { upsert: true },
    function(err, obj) {
      if (err) throw err
      else res.end('Story has been edited')
    }

  )
}

getPublishedStory = function(req, res) {
  console.log('publish page ' + req.query.page)
  let skips = (req.query.page - 1) * 5
  let client = this.dbClient
  collection = client.db('stories_example1').collection('published')
  collection.find().sort({ _id: -1 }).skip(skips).limit(5).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find published Stories')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fufill Story request')
      res.send({
        status: 'FAILURE'
      })
      return
    }
    let response_data = []
    docs.map((pubStory) => {
      var publishObj = new Object()
      publishObj._id = pubStory._id
      publishObj.edited_timestamp = pubStory.edited_timestamp
      publishObj.title = pubStory.title
      publishObj.hook = pubStory.hook
      publishObj.content = pubStory.content
      publishObj.public_status = pubStory.public_status
      publishObj.postPhotoName = pubStory.postPhotoName
      response_data.push(pubStory)
    })
    res.send({
      status: 'SUCCESS',
      published_info: JSON.stringify(response_data)
    })
  })
}

getDraftedStories = function(req, res) {
  console.log('draft page ' + req.query.page)
  let skips = (req.query.page - 1) * 5
  let client = this.dbClient
  collection = client.db('stories_example1').collection('drafts')
  collection.find().sort({ _id: -1 }).skip(skips).limit(5).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find drafted Stories')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fufill Story request')
      res.send({
        status: 'FAILURE'
      })
      return
    }
    let response_data = []
    docs.map((draftStory) => {
      var draftObj = new Object()
      draftObj.original_timestamp = draftStory._id.getTimestamp()
      draftObj.edited_timestamp = draftStory.edited_timestamp
      draftObj.title = draftStory.title
      draftObj.hook = draftStory.hook
      draftObj.content = draftStory.content
      draftObj.postPhotoName = draftStory.postPhotoName
      draftObj.public_status = draftStory.public_status
      response_data.push(draftStory)
    })
    res.send({
      status: 'SUCCESS',
      draft_info: JSON.stringify(response_data)
    })
  })
}

deleteDraft = function(req, res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  collection = client.db('stories_example1').collection('drafts')
  collection.deleteOne(
    {
      _id: ObjectId(req.body.deleteId)
    },
    function(err, obj) {
      if (err) throw err
      else res.end('Draft Deleted Successful')
    }
  )
}

deletePublish = function(req, res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  collection = client.db('stories_example1').collection('published')
  collection.deleteOne(
    {
      _id: ObjectId(req.body.deleteId)
    },
    function(err, obj) {
      if (err) throw err
      else res.end('Published Story Deleted Successful')
    }
  )
}

getStoryEdit = function(req, res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  collection = client.db('stories_example1').collection('published')
  collection.findOne({ _id: ObjectId(req.body.id) }, function(err, result) {
    if (err) {
      throw err
    } else if (!result) {
      collection = client.db('stories_example1').collection('drafts')
      collection.findOne({ _id: ObjectId(req.body.id) }, function(e, r) {
        if (err) {
          throw err
        } else {
          res.send(r)
        }
      })
    } else {
      res.send(result)
    }
  })
}

getStoryCount = async function(req, res) {
  let client = this.dbClient
  let response_data = []
  collection = client.db('stories_example1').collection('published')
  let pubResult = await collection.countDocuments({})
		
  collection = client.db('stories_example1').collection('drafts')
	    draftResult = await collection.countDocuments({})
  var countObj = new Object()
  countObj.draftCount = draftResult
  countObj.publishCount = pubResult
  response_data.push(countObj)
  console.log(response_data)
  res.send({
    status: 'SUCESS',
    count_info: JSON.stringify(response_data)
  })
}

editEventTemplate = function (req, res) {
  let client = this.dbClient
  let categories = []
  req.body.data.forEach((category) => {
    console.log(category.food)
    var isFood = category.food.toString() === 'true' ? true : false
    categories.push(
      {
        'name': category.name,
        'max_signups': parseInt(category.max_signups,10),
        'min_servings': parseInt(category.min_servings,10),
        'food': isFood,
        'min_vegan': parseInt(category.min_vegan,10)
      }
    )
  })
  collection = client.db('events-form').collection('events')
  collection.replaceOne({ date: 'MASTER2' },
    {
      'date' : 'MASTER2',
      'location' : req.body.location,
      'time' : '6:00 pm',
      'max_servings' : req.body.max_servings,
      'categories': categories
    },{ upsert : true },
    function(err,doc) {
      if(err){
        console.log(err, 'Error trying to find master template to edit')
        res.send({
          status: 'FAILURE'
        })
        return
      }else{
        console.log('SUCCESS! [' + req.body.name +'] has been updated')
        res.end('Template Updated')
      }}
  )
}

getEventTemplate = function(req, res) {
  let client = this.dbClient
  collection = client.db('events-form').collection('events')
  collection.find({date: 'MASTER2'}, {projection:{ _id: 0}}).toArray((err, docs) => {
    if(err) {
      console.log(err, 'Error trying to get info from master template')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if(docs[0] == null) {
      console.log('Couldn\'t fulfill master template request')
      res.send({
        status: 'FAILURE'
      })
      return
    }

    // console.log(docs[0])
    let response_data = []
    docs[0].categories.forEach(category => {
      var masterObj = new Object()
      masterObj.name = category.name
      masterObj.food = category.food
      masterObj.max_signups = category.max_signups
      masterObj.min_servings = category.min_servings
      masterObj.min_vegan = category.min_vegan
      response_data.push(masterObj)
    })

    res.send({
      status: 'SUCCESS',
      event_info: JSON.stringify(response_data),
      location: docs[0].location,
      time: docs[0].time,
      max_servings: docs[0].max_servings
    })
  })
}

deleteEventTemplate = function(req, res) {
  client = this.dbClient
  console.log(req.body.category)
  collection = client.db('events-form').collection('events')
  collection.findOneAndUpdate({ date: 'MASTER2'},
    {$pull:{
      'categories':{
        'name' : req.body.category
      }
    }}, (err, doc) => {
      if (err) {
        console.log(err, 'Error trying to find master template to delete')
        res.send({
          status: 'FAILURE'
        })
        return
      } else if (doc.value === null) {
        console.log('No master template to delete with that category')
        res.send({
          status: 'FAILURE'
        })
      } else {
        console.log('SUCCESS! [' + req.body.category +'] has been deleted from the master template')
        res.end('SUCCESS')
        return
      }
    })
}

getVolunteerHistory = async function(req, res) {
  try {
    let response_data = []
    client = this.dbClient
    collection = client.db('events-form').collection('events')
    let cursor = collection.aggregate([
      {$match: {'categories.submissions.volunteer_email': req.body.email}},
      {$unwind: '$categories'},
      {$match: {'categories.submissions.volunteer_email': req.body.email}},
      {$unwind: '$categories.submissions'},
      {$match: {'categories.submissions.volunteer_email': req.body.email}}
    ])
		
    while(await cursor.hasNext()) {
      let doc = await cursor.next()
      response_data.push({
        date: doc.date,
        name: doc.categories.submissions.volunteer_name,
        email: doc.categories.submissions.volunteer_email,
        type: doc.categories.name,
        desc: doc.categories.submissions.description,
        servings: doc.categories.submissions.servings,
        vegan: doc.categories.submissions.vegan,
        vegetarian: doc.categories.submissions.vegetarian,
        gluten_free: doc.categories.submissions.gluten_free
      })
    }

    res.send({
      sub_info: response_data,
      status: 'SUCCESS'
    })
  } catch (err) {
    console.log('Error retrieving volunteer history', err)
    res.send({
      status: 'FAILURE'
    })
  }
}

editContent = function(req, res) {
  client = this.dbClient
  let collection = client.db('beautiful-portland').collection('site-content')
  collection.findOneAndReplace({type: req.body.type}, req.body, (err, result) => {
    if(err) {
      console.log(err, 'Error trying to find ' + req.body.type + ' in db')
    } else if(!result.ok) {
      console.log('Something went wrong updating ' + req.body.type)
    }

    res.send({
      status: 'SUCCESS'
    })
  })
}

getCalendarFAQEdit = function(req, res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  collection = client.db('events-form').collection('frequently-asked-questions')
  collection.find({ _id: ObjectId(req.body.id) }).sort({ 'question': -1 }).toArray((err, result) => {
    if (err) {
      throw err
    } else {
      res.send(result)
    }
  })
}

addCalendarFAQ = function(req, res) {
  let client = this.dbClient
  console.log(req.body)
  collection = client.db('events-form').collection('frequently-asked-questions')
  collection.updateOne(
    { question: req.body.question },
    {
      $set: {
        question: req.body.question,
        answer: req.body.answer
      }
    },
    { upsert: true },
    function(err, obj) {
      if (err) throw err
      else res.end('Calendar FAQ Published')
    }
  )
}

editCalendarFAQ = function(req,res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  console.log(req.body.publish_status)
  collection = client.db('events-form').collection('frequently-asked-questions')
  collection.updateOne(
    {_id: ObjectId(req.body._id)},
    {
      $set: {
        question: req.body.question,
        answer: req.body.answer
      }
    },
    { upsert: true },
    function(err, obj) {
      if (err) throw err
      else res.end('Calendar FAQ has been edited')
    }
  )
}

deleteCalendarFAQ = function(req, res) {
  var ObjectId = require('mongodb').ObjectID
  let client = this.dbClient
  collection = client.db('events-form').collection('frequently-asked-questions')
  collection.deleteOne(
    {
      _id: ObjectId(req.body.deleteId)
    },
    function(err, obj) {
      if (err) throw err
      else res.end('Calendar FAQ Deleted Successful')
    }
  )
}

module.exports.addPhotos = addPhotos
module.exports.removePhotos = removePhotos
module.exports.removeImagesFromFrontPage = removeImagesFromFrontPage
module.exports.addFromUploaded = addFromUploaded
module.exports.addImageIntoStories = addImageIntoStories
module.exports.removeImageFromStories = removeImageFromStories
module.exports.getFullEventInfo = getFullEventInfo
module.exports.getVolunteerList = getVolunteerList
module.exports.postAddEvent = postAddEvent
module.exports.updateEvent = updateEvent
module.exports.deleteEvent = deleteEvent
module.exports.addNewDraft = addNewDraft
module.exports.addNewPublished = addNewPublished
module.exports.getPublishedStory = getPublishedStory
module.exports.getDraftedStories = getDraftedStories
module.exports.deleteDraft = deleteDraft
module.exports.deletePublish = deletePublish
module.exports.getStoryEdit = getStoryEdit
module.exports.editEventTemplate = editEventTemplate
module.exports.getEventTemplate = getEventTemplate
module.exports.deleteEventTemplate = deleteEventTemplate
module.exports.editedStory = editedStory
module.exports.getStoryCount = getStoryCount
module.exports.getVolunteerHistory = getVolunteerHistory
module.exports.editContent = editContent
module.exports.getCalendarFAQEdit = getCalendarFAQEdit
module.exports.addCalendarFAQ = addCalendarFAQ
module.exports.editCalendarFAQ = editCalendarFAQ
module.exports.deleteCalendarFAQ = deleteCalendarFAQ

