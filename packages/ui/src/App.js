import React, { Component } from 'react';
import VolunteerForm from './components/VolunteerForm';
import { Container } from 'semantic-ui-react';
class App extends Component {
	render() {
		return (
			<div className="App">
				<h1>Beautiful Portland</h1>
				<p>Welcome to our site</p>
				<Container>
					<VolunteerForm />
				</Container>
			</div>
		);
	}
}

export default App;
