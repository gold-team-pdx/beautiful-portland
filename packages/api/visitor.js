// Get image presigned URL for blog post photos
getImageForStory = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  const bucket = 'beautiful-portland-carousel-photos'
  let key = 'storyPhotos/' + req.query.fileName
  try {
    let url = s3.getSignedUrl('getObject', {Bucket: bucket, Key: key})
    if(url.indexOf('undefined') === -1) {
      console.log('file retrieved successfully')
      res.send(url)
    }
    else {
      console.log('File not found!')
      res.send('No Photo')
    }
  } catch (err) {
    console.log('ERROR could not locate file : ' + JSON.stringify(err))
  }
}

// Get request to S3 container to get photos for image carousel
// Returns a list of presigned image urls from the s3 bucket.
homeImages = function(req, res) {
  let AWS = this.amazon
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_BUCKET),
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  })
  const bucket = 'beautiful-portland-carousel-photos'
  let imageUrls = []
  // Checks for if on front page (or editing front page images)
  let isFront = req.query.isFrontPage
  // Checks for if we need non-front page images only (editing front page images on admin side)
  let needNotFront = req.query.needNotOnFront
  let data = s3.listObjects({Bucket:bucket}).promise()
  data.then(data => {
    data.Contents.forEach((item) => {
      let keyString = JSON.stringify(item.Key)
      // Need images not on front page
      if(needNotFront === 'true') {
        if(keyString.indexOf('frontPage') === -1) {
          let key = item.Key
          imageUrls = imageUrls.concat(s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: key,
          }))
        }
      }
      // Only get images for all images OR if we are on the front page
      // (isFront === 'true'), only get images in frontPage folder
      else if(isFront === 'false' || (keyString.indexOf('frontPage') !== -1)) {
        let key = item.Key
        imageUrls = imageUrls.concat(s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Key: key,
        }))
      }   
    })
    res.send(imageUrls)
  })
    .catch(err => {
      console.log(err)
    })
}

// Called by '/volunteer-form' to get category info for an event, to properly limit signups
volunteerFormGetEventInfo = function(req, res) {
  let client = this.dbClient
  collection = client.db('events-form').collection('events')
  collection.find({date: req.query.date}).toArray((err, docs) => {
    if(err) {
      console.log(err, 'Error trying to find document')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if(docs.length === 0) {
      console.log('Couldn\'t fulfill a document request')
      res.send({
        status: 'FAILURE'
      })
      return
    }

    let i = 0, response_data = []
    docs[0].categories.forEach(category => {
      response_data.push({
        type: category.name,
        max_signups: category.max_signups,
        real_signups: 0,
        min_servings: category.min_servings,
        min_vegan_servings: Math.ceil(Math.floor(category.min_servings/3) / 10) * 10,
        food: category.food,
        min_vegan: category.min_vegan,
        real_vegan: 0, 
        servings: 0
      })
      category.submissions.forEach(sub => {
        response_data[i].real_signups++
        if(response_data[i].food && sub.vegan) {
          response_data[i].real_vegan++
        }
        response_data[i].servings += sub.servings
      })
      i++
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

// Catch frontend POST request from volunteer signup form
volunteerFormSubmit = function(req, res) {
  let client = this.dbClient
  //updates Document in mongodb
  collection = client.db('events-form').collection('events')
  collection.updateOne(
    {$and: [{date:req.body.date}, {'categories.name':req.body.type}]},
    {$push: {'categories.$.submissions': {
      'description' : req.body.description,
      'servings' : JSON.parse(req.body.servings),
      'vegetarian': req.body.vegetarian,
      'vegan': req.body.vegan,
      'gluten_free': req.body.gluten_free,
      'volunteer_name': req.body.volunteer_name,
      'volunteer_phone': req.body.volunteer_phone,
      'volunteer_email': req.body.volunteer_email
    }}}, //$push
    function(err,resu){
      if (err)
        console.log(err,'Event Not Added')
      else{
        if(resu.result.nModified == 1){
          console.log('Event Modified -- Added New Submission')
          collection = client.db('volunteer_info').collection('volunteers')
          collection.updateOne(
            {'volunteer_email' : req.body.volunteer_email},
            {$set: {'volunteer_email' : req.body.volunteer_email,
              'volunteer_name' : req.body.volunteer_name,
              'volunteer_phone' : req.body.volunteer_phone}},
            {upsert : true},
            function(err, result) {
              if(err)
                console.log(err, 'Volunteer Not Updated')
              else{
                console.log('Volunteer Added or Updated')
                res.send('All Collections Updated')
              }
            }
          )
        }else{
          console.log('Error: Event Not Updated -- No matching date or type found -- Volunteer also not updated')
          res.send('No Collections Updated')
        }
      }
    })
}

eventCalendar = function(req, res) {
  let client = this.dbClient
  collection = client.db('events-form').collection('events') 
  collection.find({}).toArray((err, docs) => {
    if(err) {
      console.log(err, 'Error trying to find document')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if(docs.length === 0) {
      console.log('Couldn\'t fulfill a document request')
      res.send({
        status: 'FAILURE'
      })
      return
    }

    let response_data = []
    docs.forEach(info => {
      if(info.date !== 'MASTER') {
        var eventObj = new Object()
        eventObj._id = info._id
        eventObj.title = 'Free Hot Soup'
        eventObj.location = info.location
        eventObj.start = info.date
        eventObj.end = info.date
        eventObj.time = info.time
        eventObj.allDay = false
        eventObj.coordinator = info.coordinator
        eventObj.coordinator_phone = info.coordinator_phone
        response_data.push(eventObj)
      }
    })

    res.send({
      status: 'SUCCESS',
      event_info: JSON.stringify(response_data)
    })
  })
}

displayStory = function(req, res) {
  let client = this.dbClient
  collection = client.db('stories_example1').collection('published')
  collection.find().sort({ _id: -1 }).limit(50).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find published Stories')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fulfill Story request')
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
      response_data.push(pubStory)
    })
    res.send({
      status: 'SUCCESS',
      published_info: JSON.stringify(response_data)
    })
  })
}

getOneStory = function(req, res) {
  let client = this.dbClient
  collection = client.db('stories_example1').collection('published')
  collection.find({title: req.query.title}).sort({ _id: -1 }).limit(50).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find published Stories')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fulfill Story request')
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
      response_data.push(pubStory)
    })
    res.send({
      status: 'SUCCESS',
      published_info: JSON.stringify(response_data)
    })
  })
}

getContent= function(req, res) {
  let client = this.dbClient
  collection = client.db('beautiful-portland').collection('site-content')
  if(req.query.type === 'all') {
    collection.find({}, {projection: {_id: 0}}).toArray((err, docs) => {
      if(err) {
        console.log(err, 'Error looking for content')
        res.send({
          status: 'FAILURE'
        })
        return
      } else if(docs.length === 0) {
        console.log('Content not found')
        res.send({
          status: 'FAILURE'
        })
        return
      }

      res.send({
        status: 'SUCCESS',
        content: docs
      })
    })
  } else {
    collection.findOne({type: req.query.type}, (err, doc) => {
      if(err) {
        console.log(err, 'Error looking for content')
        res.send({
          status: 'FAILURE'
        })
        return
      } else if(!doc) {
        console.log(err, 'Content not found')
        res.send({
          status: 'FAILURE'
        })
      }

      res.send({
        status: 'SUCCESS',
        content: doc.content
      })
    })
  }
}
  
getCalendarFAQ = function(req, res) {
  let client = this.dbClient
  collection = client.db('events-form').collection('frequently-asked-questions')
  collection.find().sort({ _id: -1 }).limit(50).toArray((err, docs) => {
    if (err) {
      console.log(err, 'Error trying to find Calendar FAQ')
      res.send({
        status: 'FAILURE'
      })
      return
    } else if (docs[0] == null) {
      console.log('Couldn\'t fulfill Calendar FAQ request')
      res.send({
        status: 'FAILURE'
      })
      return
    }
    let response_data = []
    docs.map((faq) => {
      var faqObj = new Object()
      faqObj._id = faq._id
      faqObj.edited_timestamp = faq.question
      faqObj.title = faq.answer
      response_data.push(faq)
    })
    res.send({
      status: 'SUCCESS',
      faq_info: JSON.stringify(response_data)
    })
  })
}

module.exports.homeImages = homeImages
module.exports.volunteerFormSubmit = volunteerFormSubmit
module.exports.volunteerFormGetEventInfo = volunteerFormGetEventInfo
module.exports.eventCalendar = eventCalendar
module.exports.getImageForStory = getImageForStory
module.exports.displayStory = displayStory
module.exports.getOneStory = getOneStory
module.exports.getContent = getContent
module.exports.getCalendarFAQ = getCalendarFAQ
