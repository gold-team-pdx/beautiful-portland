import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Components/Home/Home'
import About from './Components/About/About'
import VolunteerForm from './Components/Volunteer/VolunteerForm'
import Login from './Components/Dashboard/Login'
import AdminDashboard from './Components/Dashboard/AdminDashboard'
import ContactUs from './Components/Contact/ContactUs.js'
import NoMatch from './Components/Error/NoMatch'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/volunteer-form" component={VolunteerForm} />
            <Route path="/login" component={Login} />
            <Route path="/admin-dashboard" component={AdminDashboard} />
            <Route path="/ContactUs" component={ContactUs} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
