import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MyProvider from './Components/Context/MyProvider'
import Home from './Components/Home/Home'
import About from './Components/About/About'
import VolunteerForm from './Components/Volunteer/VolunteerForm'
import Login from './Components/Dashboard/Login'
import AdminDashboard from './Components/Dashboard/AdminDashboard'
import ContactUs from './Components/Contact/ContactUs.js'
import Stories from './Components/Stories/Stories.js'
import NoMatch from './Components/Error/NoMatch'
import './App.css'

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
						<Route path="/admin-dashboard" component={AdminDashboard} />
						<Route path="/ContactUs" component={ContactUs} />
						<Route path="/Stories" component={Stories} />
						<Route component={NoMatch} />
					</Switch>
				</Router>
			</MyProvider>
		)
	}
}

export default App
