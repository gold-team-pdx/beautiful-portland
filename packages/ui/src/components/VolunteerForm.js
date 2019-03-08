<<<<<<< HEAD
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
=======
import React, { Component } from 'react'
import Item from './Item'
import { Header } from 'semantic-ui-react'
import Axios from 'axios'

export default class VolunteerForm extends Component {
	onSubmit = (data) => {
		console.log(JSON.stringify(data, null, 3))
		Axios.post('/api/form', {
			param: {
				// body: JSON.stringify(data),		//axios uses JSON as default content type
				body: JSON.stringify(data),
				date: "03/07/2019"
			},
			header: {		
				"Content-Type": "application/json"
>>>>>>> da41b82b5a4fb1696847a8a328204526b7cb7074
			}
		}).then(response => {
			console.log(response, 'Form Submitted')
		}).catch(err => {
			console.log(err, 'Try again.')
		})
<<<<<<< HEAD
	};
=======
	}
>>>>>>> da41b82b5a4fb1696847a8a328204526b7cb7074
	render() {
		return (
			<div>
				<Header as="h2">Director Park Dinner Sign-Up:</Header>
				<Header as="h2">Name and Contact info of Volunteer Co-ordinator: </Header>

				<Item onSubmit={this.onSubmit} />
			</div>
<<<<<<< HEAD
		);
=======
		)
>>>>>>> da41b82b5a4fb1696847a8a328204526b7cb7074
	}
}
