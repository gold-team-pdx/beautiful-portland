import React, { Component } from 'react';
import VolunteerForm from './components/VolunteerForm';
import { Container } from 'semantic-ui-react';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Container>
					<VolunteerForm />
				</Container>
			</div>
		);
	}
}

export default App;
