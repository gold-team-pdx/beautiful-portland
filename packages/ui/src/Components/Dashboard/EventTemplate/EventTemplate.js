import React, { Component } from 'react'
import { Form, Button, Segment, Icon, Modal, Header } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import Axios from 'axios'
import Moment from 'moment'
import '../../Stylesheets/EventTemplate.css'

export default class EventTemplate extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.validateField = this.validateField.bind(this)
    this.errorClass = this.errorClass.bind(this)
    this.state = {
      time: props.time,
      location: props.location,
      max_servings : props.max_servings,
      name: props.event_info.name,
      max_signups : props.event_info.max_signups,
      min_servings : props.event_info.min_servings,
      food : props.event_info.food,
      min_vegan : props.event_info.min_vegan,
      errors: {
        time: '',
        location: '',
        max_servings: '',
        name: '',
        max_signups : '',
        min_servings : '',
        min_vegan : ''
      },
      timeValid: false,
      locationValid: false,
      nameValid: false,
      max_servingsValid: false,
      max_signupsValid: false,
      min_servingsValid: false,
      min_veganValid: false,
      formValid: false,
      categoryToDelete:'',
      open: false,
      newTime: new Date(),
    }
  }

    onSubmit = (e) => {
      e.preventDefault()
      this.props.onSubmit(this.state)
    }

    updateCheckbox = (event, data) => {
      this.setState({ [data.name]: data.checked })
    }

	onChange = (event, data) => {
	  this.setState({ [data.name]: data.value }, () => {
	    this.validateField(data.name, data.value)
	  })
	}

    timeChanged = (t) => {
      this.setState({ newTime: t },()=>{
        this.setState({ time: Moment(this.state.newTime).format('h:mm A')})
      })
    }

    displayDeleteModal = (event, data) => {
      this.setState({ categoryToDelete: data.name })
      this.openModal()
    }

    openModal = () => {
      this.setState({ open: true })
    }

    closeModal = () => {
      this.setState({ open: false })
    }

    deleteEvent = (event, data) => {
      const deletedEventTemplate = {category: data.name}
      console.log(deletedEventTemplate)
      Axios.post('/api/deleteEventTemplate', deletedEventTemplate)
        .then((response) => {
          console.log(response, 'Deleted Event ' + data.name)
        })
        .catch((err) => {
          console.log(err, 'Try again.')
        })
      this.closeModal()
      window.location.reload()
    }

    validateField(fieldName, value) {
      let errors = this.state.errors
      let locationValid = this.state.locationValid
      let nameValid = this.state.nameValid
      let timeValid = this.state.timeValid
      let max_servingsValid = this.state.max_servingsValid
      let max_signupsValid = this.state.max_signupsValid
      let min_servingsValid = this.state.min_servingsValid
      let min_veganValid = this.state.min_veganValid

      switch (fieldName) {
      case 'location':
        locationValid = value.length > 5
        errors.location = locationValid ? '' : ' ✗ Please enter a valid location'
        break
      case 'name':
        nameValid = value.length > 2
        errors.name = nameValid ? '' : ' ✗ Please enter a valid name.'
        break
      case 'time':
        timeValid = value
        errors.time = timeValid ? '' : ' ✗ Please enter a valid time (HH:MM AM or PM).'
        break
      case 'max_servings':
        max_servingsValid = value > 0
        errors.max_servings = max_servingsValid ? '' : ' ✗ Please enter a valid number for the max servings.'
        break
      case 'max_signups':
        max_signupsValid = value > 0
        errors.max_signups = max_signupsValid ? '' : ' ✗ Please enter max signups'
        break
      case 'min_servings':
        min_servingsValid = value > 0 && value <= this.props.max_servings
        errors.min_servings = min_servingsValid ? '' : ' ✗ Please enter a valid number between 0~' + this.props.max_servings + '.'
        break
      case 'min_vegan':
        min_veganValid = value < this.props.max_servings/3
        errors.min_vegan = min_veganValid ? '' : ' ✗ Please enter min vegan.'
        break
      default:
        break
      }

      this.setState(
        {
          errors,
          locationValid,
          nameValid,
          timeValid,
          max_servingsValid,
          max_signupsValid,
          min_servingsValid,
          min_veganValid,
        },
        this.validateForm
      )
    }

    validateForm() {
      this.setState({
        formValid:
                this.state.locationValid &&
                this.state.nameValid &&
                this.state.timeValid &&
                this.state.max_servingsValid &&
                this.state.max_signupsValid &&
				this.state.min_servingsValid &&
				this.state.min_veganValid
      })
    }

    errorClass(error) {
      return error.length === 0 ? '' : 'has-error'
    }

    render() {
      return (
        <div>
          <Segment>
            <Form onSubmit={this.onSubmit}>
              <br />
              <div className={`input-wrapper ${this.errorClass(this.state.errors.location)}`}>
                <Form.Group inline>
                  <Form.Input
                    name="location"
                    value={this.state.location}
                    onChange={this.onChange}
                    inline
                    label="Location"
                  />
                  <div>
                    <span>{this.state.errors.location || ' ✓'}</span>
                  </div>
                </Form.Group>
              </div>

              <div>
                <Form.Group inline>
                  <label>Event Time: {this.state.time}</label>
                  <DatePicker
                    selected={this.state.newTime}
                    onChange={this.timeChanged}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    dateFormat="hh:mm aa"
                    timeCaption="Time"
                  />
                </Form.Group>
              </div>

              <div className={`input-wrapper ${this.errorClass(this.state.errors.max_servings)}`}>
                <Form.Group inline>
                  <Form.Input
                    name="max_servings"
                    value={this.state.max_servings}
                    onChange={this.onChange}
                    inline
                    label="Max Servings"
                  />
                  <div>
                    <span>{this.state.errors.max_servings || ' ✓'}</span>
                  </div>
                </Form.Group>
              </div>

              <div className={`input-wrapper ${this.errorClass(this.state.errors.name)}`}>
                <Form.Group inline>
                  <Form.Input
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    inline
                    label="Name"
                  />
                  <div>
                    <span>{this.state.errors.name || ' ✓'}</span>
                  </div>
                </Form.Group>
              </div>

              <Form.Group inline>
                <Form.Checkbox
                  toggle
                  name="food"
                  onChange={this.updateCheckbox}
                  checked={this.state.food}
                  label="Food"
                />
              </Form.Group>

              <div className={`input-wrapper ${this.errorClass(this.state.errors.max_signups)}`}>
                <Form.Group inline>
                  <Form.Input
                    name="max_signups"
                    value={this.state.max_signups }
                    onChange={this.onChange}
                    inline
                    label="Maximum Signups"
                  />
                  <div>
                    <span>{this.state.errors.max_signups || ' ✓'}</span>
                  </div>
                </Form.Group>
              </div>

              <div className={`input-wrapper ${this.errorClass(this.state.errors.min_servings)}`}>
                <Form.Group inline>
                  <Form.Input
                    name="min_servings"
                    value={this.state.min_servings }
                    onChange={this.onChange}
                    inline
                    label="Minimum Servings"
                  />
                  <div>
                    <span>{this.state.errors.min_servings || ' ✓'}</span>
                  </div>
                </Form.Group>
              </div>

              <div className={`input-wrapper ${this.errorClass(this.state.errors.min_vegan)}`}>
                <Form.Group inline>
                  <Form.Input
                    name="min_vegan"
                    value={this.state.min_vegan }
                    onChange={this.onChange}
                    inline
                    label="Minimum Vegan"
                  />
                  <div>
                    <span>{this.state.errors.min_vegan || ' ✓'}</span>
                  </div>
                </Form.Group>
              </div>
              <br />
              <Button color="green" /*disabled={!this.state.formValid}*/>
                        Apply Changes
              </Button>
            </Form>
            <br />
            <Button negative onClick={this.displayDeleteModal} name={this.state.name}>
                        Delete
            </Button>
          </Segment>
          <Modal open={this.state.open} onClose={this.closeModal} closeIcon>
            <Header icon="calendar alternate outline" content="Delete Template" />
            <Modal.Content>
              <h3>Are you sure you want to delete [{this.state.name}] template?</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.closeModal}>
                <Icon name="remove" /> No
              </Button>
              <Button color="green" onClick={this.deleteEvent} name={this.state.categoryToDelete}>
                <Icon name="checkmark" /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
          <br />
        </div>
      )
    }
}