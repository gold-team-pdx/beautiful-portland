import React, { Component } from 'react'
import Item from './Item'
import { Header, Container } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Axios from 'axios'
import Moment from 'moment'

export default class VolunteerForm extends Component {
	constructor(props) {
		super(props)

<<<<<<< HEAD
		/*let params = new URLSearchParams(this.props.location.search)
		if (params.get('date') === null) {
			params.append('date', new Moment().format('MM-DD-YY'))
		}*/
		this.state = {
			validEvent: true,
			date: '5-9-19',
=======
		let dateToUse

		if(this.props.date) {
			dateToUse = this.props.date
		} else {
			let params = new URLSearchParams(this.props.location.search)
			if (params.get('date') === null) {
				params.append('date', new Moment().format('MM-DD-YY'))
			}
			dateToUse = params.get('date')
		}
		this.state = {
			validEvent: true,
			date: dateToUse,
>>>>>>> 0d03a98f370dbe31d66ba78a451c8692cc8d21a2
			coordinator: '',
			coordinator_phone: '',
			location: '',
			event_info: [ { type: 'n/a', servings: 0 } ],
			max_servings: 0
		}
	}

	onSubmit = (data) => {
		data.date = this.state.date
		let cleaned = ('' + data.volunteer_phone).replace(/\D/g, '').match(/^(\d{3})(\d{3})(\d{4})$/)
		data.volunteer_phone = cleaned[1] + '-' + cleaned[2] + '-' + cleaned[3]
		
		Axios.post('/api/form', data)
			.then((response) => {
				console.log(response, 'Form Submitted')
			})
			.catch((err) => {
				console.log(err, 'Try again.')
			})
		window.location.reload()
	}

	async componentDidMount() {
		if (!this.state.date.match(/^((0[1-9])|(1[0-2])){1}-(0[1-9]|[1-2][0-9]|3[0-1]){1}-(19|[2-3][0-9]){1}$/)) {
			this.setState({ validEvent: false })
		} else {
			let path = '/api/event?date=' + this.state.date
			Axios.get(path)
				.then((res) => {
					if (res.data.status === 'SUCCESS') {
						let categories = []
						if (res.data['event_info']) {
							let data = JSON.parse(res.data['event_info'])
							data.map((category) => categories.push(category))
							this.setState({
								event_info: categories,
								location: res.data.location,
								coordinator: res.data.coordinator,
								coordinator_phone: res.data.coordinator_phone,
								max_servings: res.data.max_servings
							})
						} else {
							throw new Error('Successful GET request, but no data')
						}
					} else {
						this.setState({ validEvent: false })
					}
				})
				.catch((err) => {
					this.setState({ validEvent: false })
					console.log(err, 'Error Retrieving Event Information')
				})
		}
	}

	render() {
		return (
			<div>
				
					<Container>
						<Header as="h4" style={{ marginTop: '20px' }}>
							Dinner Sign-Up{' '}
						</Header>
						<Header as="h4">Volunteer Coordinator: {this.state.coordinator}</Header>
						<Header as="h4">Volunteer Coordinator Phone: {this.state.coordinator_phone}</Header>
						<Header as="h4">Location: {this.state.location}</Header>
						<Header as="h4">Date: {this.state.date} </Header>
						<Item
							onSubmit={this.onSubmit}
							event_info={this.state.event_info}
							max_servings={this.state.max_servings}
						/>
					</Container>
<<<<<<< HEAD
				
				
				
=======
				) : (
					<Container>
						<Header as="h2" style={{ marginTop: '20px' }}>
							There is no event scheduled for this date
						</Header>
					</Container>
				)}
>>>>>>> 0d03a98f370dbe31d66ba78a451c8692cc8d21a2
			</div>
		)
	}
}
