const dbConfig = require('./config/db')
var authConfig = require('./config/auth')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const AWS = require('aws-sdk')
const app = express()
const port = process.env.PORT || 5000
const uri = dbConfig.mongodbURL

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

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

// serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// deserialize the user
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// passport config
passport.use(new GoogleStrategy(
    authConfig.google,
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
));

// let google to authentication the admin
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile']
}))

// the callback after google authenticated the admin
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    req.session.token = req.user.token
    res.redirect('http://localhost:3000/admin-dashboard');
  }
)

// route for admin-dashboard
app.get('/admin-dashboard', ensureAuthenticated, function(req, res) {
    res.send(req.user)
})

// logout
app.get('/logout', function(req, res) {
    req.logout();
    req.session = null;
    res.redirect('http://localhost:3000/login');
})

//express middleware to check if admin is logged in.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.emails[0].value=="ronniesong0809@gmail.com"){
      console.log("Welcome "+ req.user.displayName)
      console.log("Your email is "+ req.user.emails[0].value)
      return next();
    }else{
      console.log("You are not admin")
      req.logout();
      res.redirect('http://localhost:3000/login');
    }
}

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

// Catch frontend POST request
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
        function(err,result){
            if (err)
                console.log(err,"Event Not Added")
            else{
                console.log("Added")
                res.send("Updated")
            }
    })
})

// SELECT * FROM volunteers WHERE first = "Alexander"
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
//     console.log("Connection Success!\n")
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

// Method to retrieve list of all volunteers.
// Returns array of objects for volunteer name, email, and phone number.
// NOTE: THIS IS WORK IN PROGRESS. NO LOGIN CHECK UNTIL PASSPORT SET UP. 
app.get('/api/volunteerList', (req, res) => {
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
})
