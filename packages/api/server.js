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
const visitorHandlers = require('./visitor')
const adminHandlers = require('./admin')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
    done(null, user)
})

// deserialize the user
passport.deserializeUser(function(obj, done) {
    done(null, obj)
})

// passport config
passport.use(new GoogleStrategy(
    authConfig.google,
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
  let adminIsAuthenticated = req.isAuthenticated() && req.user.emails[0].value==authConfig.adminAccount
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
app.get('/api/getImages', visitorHandlers.homeImages.bind({amazon: AWS}))
app.get('/api/event', visitorHandlers.volunteerFormGetEventInfo.bind({dbClient: client}))
app.post('/api/form', visitorHandlers.volunteerFormSubmit.bind({dbClient: client}))


// Admin request handlers
app.get('/api/admin-dashboard', ensureAuthenticated, function(req, res) {
  res.send({
    userInfo: req.user,
    authenticated: true,
    message: 'Welcome back'
  })
})
app.get('/api/volunteerInformation', ensureAuthenticated, adminHandlers.getFullEventInfo.bind({dbClient: client}))
app.get('/api/volunteerList', ensureAuthenticated, adminHandlers.getVolunteerList.bind({dbClient: client}))
app.post('/api/deleteEvent', adminHandlers.deleteEvent.bind({dbClient: client}))
