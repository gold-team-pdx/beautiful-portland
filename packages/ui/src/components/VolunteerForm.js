import React, { Component } from 'react';
import Item from './Item';
import { Header } from 'semantic-ui-react';
import Axios from 'axios';

export default class VolunteerForm extends Component {
	onSubmit = (data) => {
		console.log(JSON.stringify(data, null, 3));
		Axios.post('/api/form', {
			body: data,
			header: {		
				'Content-Type': 'application/json'
			}
		}).then(response => {
			console.log(response, 'Form Submitted')
		}).catch(err => {
			console.log(err, 'Try again.')
		})
	};
	render() {
		return (
			<div>
				<Header as="h2">Director Park Dinner Sign-Up:</Header>
				<Header as="h2">Name and Contact info of Volunteer Co-ordinator: </Header>

				<Item onSubmit={this.onSubmit} />
			</div>
		);
	}
}
