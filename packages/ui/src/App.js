import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './Components/Home'
import VolunteerForm from './Components/VolunteerForm'
import AdminDashboard from './Components/AdminDashboard'
import './App.css'

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Route exact path="/" component={Home} />
					<Route path="/volunteer-form" component={VolunteerForm} />
					<Route path="/admin-dashboard" component={AdminDashboard} />
				</div>
			</Router>
		)
	}
}

export default App
