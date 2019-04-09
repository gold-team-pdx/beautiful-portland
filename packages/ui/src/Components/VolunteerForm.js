import React, { Component } from 'react'
import Item from './Item'
import { Header, Container } from 'semantic-ui-react'
import Axios from 'axios'
import Moment from 'moment'

export default class VolunteerForm extends Component {
	constructor(props) {
		super(props)
		let params = new URLSearchParams(this.props.location.search)
		if (params.get('date') === null) {
			params.append('date', new Moment().format('MM-DD-YY'))
		}
		this.state = {
			date: params.get('date')
		}
	}

	onSubmit = (data) => {
		data.date = this.state.date
		Axios.post('/api/form', data)
		.then((response) => {
			console.log(response, 'Form Submitted')
		})
		.catch((err) => {
			console.log(err, 'Try again.')
		})
	}

	componentDidMount() {
		let path = '/api/event?date=' + this.state.date
		Axios.get(path).then((response) => {
			console.log(response.data)
		})
	}

	render() {
		return (
			<div>
				<Container>
					<Header as="h2" style={{marginTop: '20px'}}>Director Park Dinner Sign-Up:</Header>
					<Header as="h2">Name and Contact info of Volunteer Coordinator: </Header>
					<Header as="h2">Date: {this.state.date} </Header>
					<Item onSubmit={this.onSubmit} />
				</Container>
			</div>
		)
	}
}
