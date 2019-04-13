import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MyProvider from './Components/Context/MyProvider'
import Home from './Components/Home/Home'
import VolunteerForm from './Components/Volunteer/VolunteerForm'
import AdminDashboard from './Components/Dashboard/AdminDashboard'
import './App.css'

class App extends Component {
	render() {
		return (
      <MyProvider>
			<Router>
				<div className="App">
					<Route exact path="/" component={Home} />
					<Route path="/volunteer-form" component={VolunteerForm} />
					<Route path="/admin-dashboard" component={AdminDashboard} />
				</div>
			</Router>
      </MyProvider>
		)
	}
}

export default App
