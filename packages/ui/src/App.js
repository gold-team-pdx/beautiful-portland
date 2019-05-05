import React, { Component } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import MyProvider from "./Components/Context/MyProvider"
import Home from "./Components/Home/Home"
import About from "./Components/About/About"
import VolunteerForm from "./Components/Volunteer/VolunteerForm"
import Login from "./Components/Dashboard/Login"
import AdminDashboard from "./Components/Dashboard/AdminDashboard"
import ContactUs from "./Components/Contact/ContactUs.js"
import NoMatch from "./Components/Error/NoMatch"
import "./App.css"
import EditEventTemplate from "./Components/Dashboard/EventTemplate/EditEventTemplate"
import AddEvent from "./Components/Dashboard/AddEvent"
import UpcomingEvents from "./Components/Dashboard/UpcomingEvents"
import VolunteerList from "./Components/Dashboard/VolunteerList"
import EditCarouselImages from "./Components/Dashboard/Images/EditCarouselImages"
import ViewAllImages from "./Components/Dashboard/Images/ViewAllImages"
import NewStory from "./Components/Dashboard/Stories/NewStory"
import ViewStories from "./Components/Dashboard/Stories/ViewStories"

class App extends Component {
  render() {
    return (
      <MyProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/volunteer-form" component={VolunteerForm} />
            <Route path="/login" component={Login} />
            <Route exact path="/admin-dashboard" component={AdminDashboard} />
            <Route
              path="/admin-dashboard/EditEventTemplate"
              component={EditEventTemplate}
            />
            <Route path="/admin-dashboard/AddEvent" component={AddEvent} />
            <Route
              path="/admin-dashboard/ViewUpcomingEvents"
              component={UpcomingEvents}
            />
            <Route
              path="/admin-dashboard/VolunteerList"
              component={VolunteerList}
            />
            <Route
              path="/admin-dashboard/EditImages"
              component={EditCarouselImages}
            />
            <Route
              path="/admin-dashboard/ViewImages"
              component={ViewAllImages}
            />
            <Route path="/admin-dashboard/CreateStory" component={NewStory} />
            <Route
              path="/admin-dashboard/ViewStories"
              component={ViewStories}
            />
            <Route path="/ContactUs" component={ContactUs} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </MyProvider>
    )
  }
}

export default App
