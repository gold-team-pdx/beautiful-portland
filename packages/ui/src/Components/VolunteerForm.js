import React, { Component } from 'react'
import Item from './Item'
import { Header, Container } from 'semantic-ui-react'
import Axios from 'axios'

export default class VolunteerForm extends Component {
	onSubmit = (data) => {
		//console.log(JSON.stringify(data, null, 3))
		data.date = '03-07-19'
		Axios.post('/api/form', data)
		.then((response) => {
			console.log(response, 'Form Submitted')
		})
		.catch((err) => {
			console.log(err, 'Try again.')
		})
	}

	componentDidMount() {
		let path = '/api/event?date=03-08-19'
		Axios.get(path).then((response) => {
			console.log(response.data.data)
		})
	}

	render() {
		return (
			<div>
				<Container>
					<Header as="h2">Director Park Dinner Sign-Up:</Header>
					<Header as="h2">Name and Contact info of Volunteer Co-ordinator: </Header>
					<Item onSubmit={this.onSubmit} />
				</Container>
			</div>
		)
	}
}
