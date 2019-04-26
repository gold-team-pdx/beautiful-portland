import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Menu } from 'semantic-ui-react'
import Moment from 'moment'
import { Table } from 'semantic-ui-react'

class UpcomingEvents extends Component {
	constructor(props) {
		super(props)
		this.state = {
			date: new Moment().format('MM-DD-YY'),
			events: [
				{
					date: '04-04-19',
					location: 'Parkasdasdasdasd',
					volunteer_signups: '50',
					servings: 69
				},
				{
					date: '04-20-19',
					location: 'Park Blocs',
					volunteer_signups: '50',
					servings: 69
				},
				{
					date: '04-15-19',
					location: 'Park Blocs',
					volunteer_signups: '50',
					servings: 69
				},
				{
					date: '04-11-19',
					location: 'Park Blocs',
					volunteer_signups: '50',
					servings: 69
				}
			],
			dates: [],
			lastDate: '',
			open: false
		}
	}

	async componentDidMount() {
		this.state.dates.push('05-05-19')
		for (let index = 0; index < 4; index++) {
			this.state.dates.push(Moment('05-05-19', 'MM-DD-YY').add(index + 1, 'd').format('MM-DD-YY'))
		}
		this.state.lastDate = this.state.dates.slice(-1)[0]
	}

	deleteEvent = (e) => {
		console.log(e.currentTarget.name)
	}

	loadPrev = () => {
		this.setState({ dates: [] }, () => {
			for (let index = 10; index > 0; index--) {
				this.state.dates.push(Moment(this.state.lastDate, 'MM-DD-YY').subtract(index, 'd').format('MM-DD-YY'))
			}
			let last = this.state.dates.slice(-1)[0]
			this.setState({ lastDate: last })
			console.log(this.state.dates)
		})
	}

	loadNext = () => {
		this.setState({ dates: [] }, () => {
			for (let index = 1; index <= 10; index++) {
				this.state.dates.push(Moment(this.state.lastDate, 'MM-DD-YY').add(index, 'd').format('MM-DD-YY'))
			}
			let last = this.state.dates.slice(-1)[0]
			this.setState({ lastDate: last })
			console.log(this.state.dates)
		})
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
								<Table.Row key={event.date}>
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
