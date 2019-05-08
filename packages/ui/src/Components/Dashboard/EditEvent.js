import React, { Component } from 'react'
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Table
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import Axios from 'axios'
import Moment from 'moment'
import '../Stylesheets/EditEvent.css'

class EditEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: '',
      coordinator: '',
      coordinator_phone: '',
      newTime: new Date(),
      time: '',
      submissions: [],
      errors: {
        location: '',
        coordinator: '',
        coordinator_phone: ''
      },
      formValid: false,
      locationValid: false,
      coordinatorValid: false,
      coordinator_phoneValid: false,
      open: false
    }
  }
  componentDidMount() {
    this.loadVolunteers()
  }

  loadVolunteers = () => {
    let path = '/api/fullEvent?date=' + this.props.date
    Axios.get(path)
      .then(res => {
        if (res.data['event_info']) {
          this.setState({
            coordinator: res.data.coordinator,
            coordinator_phone: res.data.coordinator_phone,
            location: res.data.location,
            time: res.data.time,
            submissions: JSON.parse(res.data['event_info'])
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  clearForm = () => {
    this.setState({
      location: '',
      coordinator: '',
      coordinator_phone: '',
      time: '',
      submissions: [],
      errors: {
        location: '',
        coordinator: '',
        coordinator_phone: ''
      },
      formValid: false,
      locationValid: false,
      coordinatorValid: false,
      coordinator_phoneValid: false
    })
  }

  onSubmit = () => {
    this.closeModal()

    let updatedEvent = {
      date: this.props.date,
      time: Moment(this.state.newTime).format('h:mm A'),
      coordinator: this.state.coordinator,
      coordinator_phone: this.state.coordinator_phone,
      location: this.state.location,
      submissions: this.state.submissions
    }

    Axios.post('/api/updateEvent', updatedEvent)
      .then(response => {
        console.log(response, 'Updated Event')
        this.loadVolunteers()
      })
      .catch(err => {
        console.log(err, 'Try again.')
      })
  }

  onChange = (event, data) => {
    this.setState({ [data.name]: data.value }, () => {
      this.validateField(data.name, data.value)
    })
  }

  timeChanged = t => {
    this.setState({ newTime: t })
  }

  validateField = (fieldName, value) => {
    let errors = this.state.errors
    let locationValid = this.state.locationValid
    let coordinatorValid = this.state.coordinatorValid
    let coordinator_phoneValid = this.state.coordinator_phoneValid

    switch (fieldName) {
      case 'location':
        locationValid = value.length > 2
        errors.location = locationValid
          ? ''
          : ' ✗ Please enter a vaild Location.'
        break
      case 'coordinator':
        coordinatorValid = value.length > 2
        errors.coordinator = coordinatorValid
          ? ''
          : ' ✗ Please enter a vaild Name.'
        break
      case 'coordinator_phone':
        coordinator_phoneValid = value.match(
          /^[(]?[0-9]{3}[)]?[-]?[0-9]{3}[-]?[0-9]{4}$/i
        )
        errors.coordinator_phone = coordinator_phoneValid
          ? ''
          : ' ✗ Please enter a vaild Phone Number.'
        break
      default:
        break
    }

    this.setState(
      {
        errors,
        locationValid,
        coordinatorValid,
        coordinator_phoneValid
      },
      this.validateForm
    )
  }

  validateForm = () => {
    if (
      this.state.coordinatorValid ||
      this.state.coordinator_phoneValid ||
      this.state.locationValid
    ) {
      this.setState({
        formValid: true
      })
    } else {
      this.setState({
        formValid: false
      })
    }
  }

  markForDeletion = (event, data) => {
    let keys = data.name.split(':')
    let email = keys[0]
    let desc = keys[1]
    let newSubmissions = []
    this.state.submissions.forEach(submission => {
      if (submission.email === email && submission.desc === desc) {
        if (submission['marked_for_deletion']) {
          submission['marked_for_deletion'] = !submission['marked_for_deletion']
        } else {
          submission['marked_for_deletion'] = true
        }
      }
      newSubmissions.push(submission)
    })
    this.setState({ submissions: newSubmissions })
  }

  errorClass(error) {
    return error.length === 0 ? '' : 'has-error'
  }

  renderIcon = value => {
    if (value) {
      return <Icon color="green" name="checkmark" size="small" />
    } else {
      return <Icon color="red" name="times" size="small" />
    }
  }

  openModal = () => {
    this.setState({ open: true })
  }

  closeModal = () => {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <Header as="h3">{this.props.date}</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4>Time:{this.state.time && this.state.time}</h4>
            </Grid.Column>
            <Grid.Column width={4}>
              <h4>Location: {this.state.location && this.state.location}</h4>
            </Grid.Column>
            <Grid.Column width={4}>
              <h4>
                Coordinator: {this.state.coordinator && this.state.coordinator}
              </h4>
            </Grid.Column>
            <Grid.Column width={4}>
              <h4>
                Phone:{' '}
                {this.state.coordinator_phone && this.state.coordinator_phone}
              </h4>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table celled textAlign={'center'} selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Volunteer</Table.HeaderCell>
              <Table.HeaderCell>Desc</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Servings</Table.HeaderCell>
              <Table.HeaderCell>Vegan</Table.HeaderCell>
              <Table.HeaderCell>Vegetarian</Table.HeaderCell>
              <Table.HeaderCell>Gluten-Free</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.submissions &&
              this.state.submissions.map(volunteer => (
                <Table.Row key={volunteer.email + volunteer.desc}>
                  <Table.Cell>
                    <Header as="h4">
                      <Header.Content>
                        {volunteer.name}
                        <Header.Subheader>{volunteer.phone}</Header.Subheader>
                        <Header.Subheader>{volunteer.email}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{volunteer.desc}</Table.Cell>
                  <Table.Cell>{volunteer.type}</Table.Cell>
                  <Table.Cell>{volunteer.servings}</Table.Cell>
                  <Table.Cell>{this.renderIcon(volunteer.vegan)}</Table.Cell>
                  <Table.Cell>
                    {this.renderIcon(volunteer.vegetarian)}
                  </Table.Cell>
                  <Table.Cell>
                    {this.renderIcon(volunteer['gluten_free'])}
                  </Table.Cell>
                  <Table.Cell>
                    <Checkbox
                      className="deletion"
                      onChange={this.markForDeletion}
                      name={volunteer.email + ':' + volunteer.desc}
                      toggle
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <Form>
          <br />
          <Form.Group>
            <div
              className={`input-wrapper ${this.errorClass(
                this.state.errors.location
              )}`}
            >
              <Form.Input
                name="location"
                onChange={this.onChange}
                value={this.state.location}
                label="Location"
                placeholder="Park Blocs"
              />
              <span>{this.state.errors.location || ' ✓'}</span>
            </div>
            <div
              className={`input-wrapper ${this.errorClass(
                this.state.errors.coordinator
              )}`}
            >
              <Form.Input
                name="coordinator"
                value={this.state.coordinator}
                onChange={this.onChange}
                label="Coordinator"
                placeholder="Julie"
              />
              <span>{this.state.errors.coordinator || ' ✓'}</span>
            </div>
            <div
              className={`input-wrapper ${this.errorClass(
                this.state.errors.coordinator_phone
              )}`}
            >
              <Form.Input
                name="coordinator_phone"
                value={this.state.coordinator_phone}
                onChange={this.onChange}
                label="Phone"
                placeholder="xxx-xxx-xxx"
              />
              <span>{this.state.errors.coordinator_phone || ' ✓'}</span>
            </div>
            <Form.Field>
              <label>Event Time</label>
              <DatePicker
                selected={this.state.newTime}
                onChange={this.timeChanged}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                timeCaption="Time"
              />
            </Form.Field>
          </Form.Group>
          <br />
          <Form.Group inline>
            <Modal
              open={this.state.open}
              trigger={
                <Button color="teal" onClick={this.openModal}>
                  Update
                </Button>
              }
              onClose={this.closeModal}
              closeIcon
            >
              <Header
                icon="calendar alternate outline"
                content="Update Event"
              />
              <Modal.Content>
                <h3>Are you sure you want to update the event ?</h3>
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" onClick={this.closeModal}>
                  <Icon name="remove" /> No
                </Button>
                <Button color="green" onClick={this.onSubmit}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default EditEvent
