import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Menu } from 'semantic-ui-react'
import Moment from 'moment'
import { Table } from 'semantic-ui-react'
import Axios from 'axios'

class UpcomingEvents extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentDate: new Moment().format('MM-DD-YY'),
			events: [],
			dates: [ new Moment().format('MM-DD-YY') ],
			lastDate: '',
			numOfDays: 3,
			open: false
		}
	}

	componentDidMount() {
		this.initializeDates()
		let paths = []
		this.state.dates.forEach((date) => {
			const path = '/api/fullEvent?date=' + date
			paths.push(path)
		})

		/*
		Promise.all(paths)
			.then((response) => response.map((res) => console.log(res.data))
			.catch((err) => console.log(err))
			*/
		/*
		let path = '/api/fullEvent?date=04-27-19'
		Axios.get(path)
			.then((res) => {
				if (res.data['event_info']) {
					let list = JSON.parse(res.data['event_info'])
					let event = {
						coordinator: res.data.coordinator,
						phone: res.data.coordinator_phone,
						location: res.data.location,
						volunteer_signups: list.length,
						volunteers: list,
						servings: this.calculateServings(list),
						date: this.state.currentDate
					}
					this.setState((prevState) => ({
						events: [ ...prevState.events, event ]
					}))

					console.log(this.state.events)
				}
			})
			.catch((err) => {
				console.log(err)
			})
			*/
		/*
		this.state.dates.push('05-05-19')
		for (let index = 0; index < 4; index++) {
			this.state.dates.push(Moment('05-05-19', 'MM-DD-YY').add(index + 1, 'd').format('MM-DD-YY'))
		}
        this.state.lastDate = this.state.dates.slice(-1)[0]
        */
	}

	initializeDates = () => {
		for (let index = 1; index < this.state.numOfDays; index++) {
			this.state.dates.push(Moment(this.state.currentDate, 'MM-DD-YY').add(index, 'd').format('MM-DD-YY'))
		}
		this.setState({ lastDate: this.state.dates.slice(-1)[0] })
	}

	updateEvents = () => {
		let tempevent = []
		this.state.dates.forEach((newDate) => {
			let path = '/api/fullEvent?date=' + newDate
			Axios.get(path)
				.then((res) => {
					if (res.data['event_info']) {
						let tempVolunteers = JSON.parse(res.data['event_info'])
						let event = {
							coordinator: res.data.coordinator,
							coordinator_phone: res.data.coordinator_phone,
							location: res.data.location,
							volunteer_signups: tempVolunteers.length,
							volunteers: tempVolunteers,
							servings: this.calculateServings(tempVolunteers),
							date: newDate
						}
						console.log(event)
						/*
						this.setState((prevState) => ({
							events: [ ...prevState.events, event ]
						}))
						*/
						tempevent.push(event)
					}
				})
				.catch((err) => {
					console.log(err)
				})
		})
	}

	calculateServings = (volunteers) => {
		let totalServings = 0
		if (volunteers) {
			volunteers.map((volunteer) => (totalServings += volunteer.servings))
		}
		return totalServings
	}

	deleteEvent = (e) => {
		console.log(e.currentTarget.name)
	}

	generateDates = (direction) => {
		if (direction === 'backward') {
			this.setState({ dates: [] }, () => {
				for (let index = this.state.numOfDays; index > 0; index--) {
					this.state.dates.push(
						Moment(this.state.lastDate, 'MM-DD-YY').subtract(index, 'd').format('MM-DD-YY')
					)
				}
				let last = this.state.dates.slice(-1)[0]
				this.setState({ lastDate: last })
			})
		} else if (direction === 'forward') {
			this.setState({ dates: [] }, () => {
				for (let index = 1; index <= this.state.numOfDays; index++) {
					this.state.dates.push(Moment(this.state.lastDate, 'MM-DD-YY').add(index, 'd').format('MM-DD-YY'))
				}
				let last = this.state.dates.slice(-1)[0]
				this.setState({ lastDate: last })
			})
		}
	}

	loadPrev = () => {
		this.generateDates('backward')
		this.updateEvents()
	}

	loadNext = () => {
		this.generateDates('forward')
		this.updateEvents()
	}

	close = () => {
		this.setState({ open: false })
	}

	open = () => {
		this.setState({ open: true })
	}

	render() {
		return (
			<div>
				<Header as="h2">Upcoming Events</Header>
				<Table celled textAlign="center" selectable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Date</Table.HeaderCell>
							<Table.HeaderCell>Location</Table.HeaderCell>
							<Table.HeaderCell>Volunteer Signups</Table.HeaderCell>
							<Table.HeaderCell>Servings</Table.HeaderCell>
							<Table.HeaderCell />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.state.events &&
							this.state.events.map((event) => (
								<Table.Row key={event.date + event.location}>
									<Table.Cell width={2}>
										<Button color="teal" onClick={() => this.props.updateDate(event.date)}>
											{event.date}
										</Button>
									</Table.Cell>
									<Table.Cell>{event.location}</Table.Cell>
									<Table.Cell>{event['volunteer_signups']}</Table.Cell>
									<Table.Cell>{event.servings}</Table.Cell>
									<Table.Cell collapsing>
										<Modal
											trigger={
												<Button negative onClick={this.open}>
													Delete
												</Button>
											}
											open={this.state.open}
										>
											<Header icon="calendar alternate outline" content="Delete Event" />
											<Modal.Content>
												<h3>Are you sure you want to delete event {event.date} </h3>
											</Modal.Content>
											<Modal.Actions>
												<Button color="red" onClick={this.close}>
													<Icon name="remove" /> No
												</Button>
												<Button color="green" onClick={this.deleteEvent} name={event.date}>
													<Icon name="checkmark" /> Yes
												</Button>
											</Modal.Actions>
										</Modal>
									</Table.Cell>
								</Table.Row>
							))}
					</Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan="5">
								<Menu floated="right">
									<Menu.Item as="a" icon onClick={this.loadPrev}>
										<Icon name="chevron left" />
									</Menu.Item>
									<Menu.Item as="a" icon onClick={this.loadNext}>
										<Icon name="chevron right" />
									</Menu.Item>
								</Menu>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</div>
		)
	}
}

export default UpcomingEvents
