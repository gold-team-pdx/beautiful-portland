import React, { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import MyProvider from "./Components/MyProvider"
import Home from "./Components/Home"
import VolunteerForm from "./Components/VolunteerForm"

class App extends Component {
  render() {
    return (
      <MyProvider>
        <Router>
          <div className="App">
            <Route exact path="/" component={Home} />
            <Route path="/volunteer-form" component={VolunteerForm} />
          </div>
        </Router>
      </MyProvider>
    )
  }
}

export default App
