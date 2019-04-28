import React, { Component } from 'react'
import Item from './Item'
import { Header, Container } from 'semantic-ui-react'
import { MyContext } from '../Context/MyProvider'
import EventList from './EventList'
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
			date: params.get('date'),
			event_info: [ { type: 'n/a', servings: 0 } ],
			max_servings: 0
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
		this.setState((prevState) => {
			prevState.event_info.find((elem) => {
				return elem.type === data.type
			}).servings +=
				data.servings
			return prevState
		})
	}

	async componentDidMount() {
		let path = '/api/event?date=' + this.state.date
		Axios.get(path)
			.then((res) => {
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
				}
			})
			.catch((err) => {
				console.log(err, 'Error Retrieving Event Information')
			})
	}

	render() {
		return (
			<MyContext.Consumer>
				{(context) => {
					if (context.state.isAuthorized) {
						return <EventList date={this.state.date} />
					}
					return (
						<div>
							<Container>
								<Header as="h2" style={{ marginTop: '20px' }}>
									Dinner Sign-Up{' '}
								</Header>
								<Header as="h2">Volunteer Coordinator: {this.state.coordinator}</Header>
								<Header as="h2">Volunteer Coordinator Phone: {this.state.coordinator_phone}</Header>
								<Header as="h2">Location: {this.state.location}</Header>
								<Header as="h2">Date: {this.state.date} </Header>
								<Item
									onSubmit={this.onSubmit}
									event_info={this.state.event_info}
									max_servings={this.state.max_servings}
								/>
							</Container>
						</div>
					)
				}}
			</MyContext.Consumer>
		)
	}
}
