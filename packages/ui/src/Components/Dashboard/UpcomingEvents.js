import React, { Component } from 'react'
import { Button, Header, Icon, Menu, Table } from 'semantic-ui-react'
import Moment from 'moment'
import Axios from 'axios'
import { Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class UpcomingEvents extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentDate: new Moment().format('MM-DD-YY'),
      events: [],
      dates: [ new Moment().format('MM-DD-YY') ],
      lastDate: '',
      numOfDays: 5,
      dateToDelete: '',
      open: false
    }
  }

  componentDidMount() {
    this.initializeDates()
    this.updateEvents(this.state.dates)
  }

	initializeDates = () => {
	  for (let index = 1; index <= this.state.numOfDays; index++) {
	    this.state.dates.push(Moment(this.state.currentDate, 'MM-DD-YY').add(index, 'd').format('MM-DD-YY'))
	  }
	  this.setState({ lastDate: this.state.dates.slice(-1)[0] })
	}

	updateEvents = (dates) => {
	  let paths = []
	  dates.forEach((date) => {
	    const path = '/api/fullEvent?date=' + date
	    paths.push(path)
	  })

	  Axios.all(paths.map((l) => Axios.get(l)))
	    .then(
	      Axios.spread((...res) => {
	        res.forEach((event) => {
	          if (event.data['event_info']) {
	            let temp = JSON.parse(event.data['event_info'])
	            let newEvent = {
	              coordinator: event.data.coordinator,
	              phone: event.data.coordinator_phone,
	              location: event.data.location,
	              volunteer_signups: temp.length,
	              servings: this.calculateServings(temp),
	              volunteers: temp,
	              date: event.data.date
	            }
	            this.setState((prevState) => ({
	              events: [ ...prevState.events, newEvent ]
	            }))
	          }
	        })
	      })
	    )
	    .catch((err) => {
	      console.log(err)
	    })
	}

	calculateServings = (volunteers) => {
	  let totalServings = 0
	  if (volunteers) {
	    volunteers.map((volunteer) => (totalServings += volunteer.servings))
	  }
	  return totalServings
	}

	displayDeleteModal = (event, data) => {
	  this.setState({ dateToDelete: data.name })
	  this.openModal()
	}

	deleteEvent = (event, data) => {
	  let newEvents = this.state.events.filter((obj) => {
	    return obj.date !== data.name
	  })
	  this.setState({
	    events: newEvents
	  })

	  const deletedEvent = {
	    date: data.name
	  }

	  Axios.post('/api/deleteEvent', deletedEvent)
	    .then((response) => {
	      console.log(response, 'Deleted Event ' + data.name)
	    })
	    .catch((err) => {
	      console.log(err, 'Try again.')
	    })

	  this.closeModal()
	}

	loadPrev = () => {
	  this.setState({ events: [] }, () => {
	    let newDates = []
	    for (let i = this.state.numOfDays; i > 0; i--) {
	      newDates.push(Moment(this.state.currentDate, 'MM-DD-YY').subtract(i, 'd').format('MM-DD-YY'))
	    }
	    this.setState({
	      lastDate: newDates.slice(-1)[0],
	      currentDate: newDates[0]
	    })
	    this.updateEvents(newDates)
	  })
	}

	loadNext = () => {
	  this.setState({ events: [] }, () => {
	    let newDates = []
	    for (let i = 1; i <= this.state.numOfDays; i++) {
	      newDates.push(Moment(this.state.lastDate, 'MM-DD-YY').add(i, 'd').format('MM-DD-YY'))
	    }
	    this.setState({
	      lastDate: newDates.slice(-1)[0],
	      currentDate: newDates[0]
	    })
	    this.updateEvents(newDates)
	  })
	}

	closeModal = () => {
	  this.setState({ open: false })
	}

	openModal = () => {
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
							this.state.events.map((event, index) => (
							  <Table.Row key={index}>
							    <Table.Cell width={2}>
							      <Button color="teal" as={Link} to="/EditEvent" onClick={() => this.props.updateActiveDate(event.date)}>
							        {event.date}
							      </Button>
							    </Table.Cell>
							    <Table.Cell>{event.location}</Table.Cell>
							    <Table.Cell>{event['volunteer_signups']}</Table.Cell>
							    <Table.Cell>{event.servings}</Table.Cell>
							    <Table.Cell collapsing>
							      <Button negative onClick={this.displayDeleteModal} name={event.date}>
											Delete
							      </Button>
							    </Table.Cell>
							  </Table.Row>
							))}
	          <Modal open={this.state.open} onClose={this.closeModal} closeIcon>
	            <Header icon="calendar alternate outline" content="Delete Event" />
	            <Modal.Content>
	              <h3>Are you sure you want delete event {this.state.dateToDelete}?</h3>
	            </Modal.Content>
	            <Modal.Actions>
	              <Button color="red" onClick={this.closeModal}>
	                <Icon name="remove" /> No
	              </Button>
	              <Button color="green" onClick={this.deleteEvent} name={this.state.dateToDelete}>
	                <Icon name="checkmark" /> Yes
	              </Button>
	            </Modal.Actions>
	          </Modal>
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
