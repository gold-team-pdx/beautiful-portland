const express = require('express')
const AWS = require('aws-sdk')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const app = express()
const port = process.env.PORT || 5000
const visitorHandlers = require('./visitor')
const adminHandlers = require('./admin')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(bodyParser.json({limit:'50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.set('Content-Type', 'text/plain')
  next()
})

//Connects to MongoDB
const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true })
client.connect((err) => {
  if (err) {
    console.log(err, 'Connection to db failed')
    return
  }
})

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user)
})

// deserialize the user
passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

// passport config
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:process.env.GOOGLE_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile)
}
))

// let google to authentication the admin
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile']
  }))

// the callback after google authenticated the admin
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.UI_SERVER}/login`
  }),
  function(req, res) {
    req.session.token = req.user.token
    res.redirect(`${process.env.UI_SERVER}/admin-dashboard`)
  }
)

//express middleware to check if admin is logged in.
function ensureAuthenticated(req, res, next) {
  let adminIsAuthenticated = req.isAuthenticated() && req.user.emails[0].value==process.env.ADMIN_ACCOUNT
  if (adminIsAuthenticated){
    // console.log("Display name: "+ req.user.displayName)
    // console.log("Email: "+ req.user.emails[0].value)
    // console.log("Authenticated: " + adminIsAuthenticated)
    // console.log("You are admin\n")
    return next()
  }else{
    // console.log("Display name: "+ req.user.displayName)
    // console.log("Email: "+ req.user.emails[0].value)
    // console.log("Authenticated: " + adminIsAuthenticated)
    // console.log("You are not admin\n")
    res.redirect(`${process.env.UI_SERVER}/`)
    req.logout()
    req.session = null
  }
}

// Logging out
app.get('/api/logout', function(req, res) {
  req.logout()
  req.session = null
  res.redirect(`${process.env.UI_SERVER}/`)
})

// Visitor request handlers
app.get('/api/getImages/*', visitorHandlers.homeImages.bind({amazon: AWS}))
app.get('/api/getImageForStory', visitorHandlers.getImageForStory.bind({amazon: AWS}))
app.get('/api/event', visitorHandlers.volunteerFormGetEventInfo.bind({dbClient: client}))
app.post('/api/form', visitorHandlers.volunteerFormSubmit.bind({dbClient: client}))
app.get('/api/eventCalendar', visitorHandlers.eventCalendar.bind({dbClient: client}))
app.get('/api/displayStory', visitorHandlers.displayStory.bind({dbClient: client, amazon: AWS}))
app.get('/api/countStory', visitorHandlers.countStory.bind({dbClient: client}))
app.get('/api/getOneStory', visitorHandlers.getOneStory.bind({dbClient: client, amazon: AWS}))
app.get('/api/content', visitorHandlers.getContent.bind({dbClient: client}))
app.get('/api/getCalendarFAQ', visitorHandlers.getCalendarFAQ.bind({dbClient: client}))

// Admin request handlers
app.get('/api/admin-dashboard', ensureAuthenticated, function(req, res) {
  res.send({
    userInfo: req.user,
    authenticated: true,
    message: 'Welcome back'
  })
})

// Image admin functions
app.post('/api/removeImageFromBucket', ensureAuthenticated, adminHandlers.removeImageFromBucket.bind({amazon: AWS}))
app.post('/api/addImagesToBucket', ensureAuthenticated, adminHandlers.addPhotos.bind({amazon: AWS}))
app.post('/api/removeImagesFromFrontPage', ensureAuthenticated, adminHandlers.removeImagesFromFrontPage.bind({amazon: AWS}))
app.post('/api/addImageFromUploaded', ensureAuthenticated, adminHandlers.addFromUploaded.bind({amazon: AWS}))
app.post('/api/addImageIntoStories', ensureAuthenticated, adminHandlers.addImageIntoStories.bind({amazon: AWS}))
app.post('/api/removeImageFromStories', ensureAuthenticated, adminHandlers.removeImageFromStories.bind({amazon: AWS}))

// DB admin functions
app.get('/api/volunteerInformation', ensureAuthenticated, adminHandlers.getFullEventInfo.bind({dbClient: client}))
app.get('/api/fullEvent', ensureAuthenticated, adminHandlers.getFullEventInfo.bind({dbClient: client}))
app.get('/api/volunteerList', ensureAuthenticated, adminHandlers.getVolunteerList.bind({dbClient: client}))
app.get('/api/publishedStories', adminHandlers.getPublishedStory.bind({dbClient: client}))
app.get('/api/draftStories', ensureAuthenticated, adminHandlers.getDraftedStories.bind({dbClient: client}))
app.post('/api/getStoryEdit', ensureAuthenticated, adminHandlers.getStoryEdit.bind({dbClient: client}))
app.post('/api/addDraft', ensureAuthenticated, adminHandlers.addNewDraft.bind({dbClient: client}))
app.post('/api/addPublish', ensureAuthenticated, adminHandlers.addNewPublished.bind({dbClient: client}))
app.post('/api/deleteDraft', ensureAuthenticated, adminHandlers.deleteDraft.bind({dbClient: client}))
app.post('/api/deletePublish', ensureAuthenticated, adminHandlers.deletePublish.bind({dbClient: client}))
app.post('/api/addEvent',ensureAuthenticated,adminHandlers.postAddEvent.bind({dbClient: client}))
app.post('/api/updateEvent', ensureAuthenticated, adminHandlers.updateEvent.bind({dbClient: client}))
app.post('/api/deleteEvent', ensureAuthenticated, adminHandlers.deleteEvent.bind({dbClient: client}))
app.get('/api/getEventTemplate', ensureAuthenticated, adminHandlers.getEventTemplate.bind({dbClient: client}))
app.post('/api/editEventTemplate', ensureAuthenticated, adminHandlers.editEventTemplate.bind({dbClient: client}))
app.post('/api/deleteEventTemplate', ensureAuthenticated, adminHandlers.deleteEventTemplate.bind({dbClient: client}))
app.post('/api/editedStory', ensureAuthenticated, adminHandlers.editedStory.bind({dbClient: client}))
app.get('/api/storiesCount', adminHandlers.getStoryCount.bind({dbClient: client}))
app.post('/api/volunteerHistory', ensureAuthenticated, adminHandlers.getVolunteerHistory.bind({dbClient: client}))
app.post('/api/editContent', ensureAuthenticated, adminHandlers.editContent.bind({dbClient: client}))
app.post('/api/getCalendarFAQEdit', ensureAuthenticated, adminHandlers.getCalendarFAQEdit.bind({dbClient: client}))
app.post('/api/addCalendarFAQ', ensureAuthenticated, adminHandlers.addCalendarFAQ.bind({dbClient: client}))
app.post('/api/editCalendarFAQ', ensureAuthenticated, adminHandlers.editCalendarFAQ.bind({dbClient: client}))
app.post('/api/deleteCalendarFAQ', ensureAuthenticated, adminHandlers.deleteCalendarFAQ.bind({dbClient: client}))
app.post('/api/emergencyRefresh', ensureAuthenticated, adminHandlers.emergencyRefresh.bind({dbClient: client}))
