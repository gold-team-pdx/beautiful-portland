import React, { Component } from 'react'
import Axios from 'axios'
import { Header, Form, Segment, Button } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import "react-datepicker/dist/react-datepicker.css"
import '../Stylesheets/Item.css'

export default class AddEvent extends Component {
  constructor(props){
    super(props)
    this.handleName = this.handleName.bind(this)
    this.handlePhone = this.handlePhone.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
    this.dateChanged = this.dateChanged.bind(this)
    this.timeChanged = this.timeChanged.bind(this)
    this.validateField = this.validateField.bind(this)
		this.errorClass = this.errorClass.bind(this)
    this.state = {
      date: new Date(),
      time: new Date(),
      coordinatorName: '',
      coordinatorPhone:'',
      error: {
        name: '',
        phone: ''
      },
      phoneValid: false,
      nameValid: false,
      formValid: false
      }
    }
 /* I tried to write a catch all onChange handler and was having some issues with
    type errors. If there is time a refactor of indivual handlers into a generic
    would be cool.
 */

  /* Datepicker validates and formats date and time. Only need to check if null */
    dateChanged(d){
      this.setState({date: d})
      this.validateForm()
    }

    timeChanged(t){
      this.setState({time: t})
      this.validateForm()
    }

    handleName(event) {
  		this.setState({coordinatorName: event.target.value })
      this.validateField('coordinatorName', event.target.value)
    }

    handlePhone(event) {
  		this.setState({coordinatorPhone: event.target.value })
      this.validateField('coordinatorPhone', event.target.value)
    }

 /* Creates obj and sends via post. Clears form */
    handleSubmit(event) {
      const newEvent = {
        newDate: Moment(this.state.date).format('MM-DD-YY'),
        newTime: Moment(this.state.time).format('h:mm a'),
        newCoorName: this.state.coordinatorName,
        newCoorPhone: this.state.coordinatorPhone
      }

      Axios.post("/api/addEvent", newEvent)
        .then(response => {
          console.log(response, "Add Event Submitted")
        })
        .catch(err => {
          console.log(err, "Try again.")
        })
      this.clearForm()
      //console.log(newEvent)
    }

    clearForm = () => {
      this.setState({
        date: new Date(),
        time: new Date(),
        coordinatorName: '',
        coordinatorPhone:'',
        error: {
          name: '',
          phone: ''
        },
        nameValid: false,
        phoneValid: false,
        formValid: false
      })
    }

    validateField(fieldName, value){
      let error = this.state.error
      let phoneValid = this.state.phoneValid
      let nameValid = this.state.nameValid

      switch(fieldName) {
        case 'coordinatorName':
  				nameValid = value.length > 2
  				error.name = nameValid ? '' : ' ✗ Please enter a vaild Name.'
  				break
  			case 'coordinatorPhone':
  				phoneValid = value.match(/^[(]?[0-9]{3}[)]?[-]?[0-9]{3}[-]?[0-9]{4}$/i)
  				error.phone = phoneValid ? '' : ' ✗ Please enter a vaild phone number.'
  				break
        default:
          break
      }

      this.setState(
  			{
  				error,
  				nameValid,
          phoneValid
  			},
  			this.validateForm
  		)
    }

    validateForm() {
      let validDateAndTime = false
      if(this.state.date && this.state.time) {
        validDateAndTime = true
      }
  		this.setState({
  			formValid:
          this.state.nameValid &&
          this.state.phoneValid && validDateAndTime

  		})
  	}

    errorClass(error) {
  		return error.length === 0 ? '' : 'has-error'
  	}

    render() {
      return (
      <Segment>
        <Form onSubmit={(this.handleSubmit)}>
          <Header as="h1">Add New Event</Header>
          <Form.Group widths='equal'>
           <Form.Field>
            <label>Event Date</label>
            <DatePicker
              dateFormat="MM-dd-yy"
              selected={this.state.date}
              onChange={this.dateChanged}
            />
          </Form.Field>
          <Form.Field>
            <label>Event Time</label>
            <DatePicker
              selected={this.state.time}
              onChange={this.timeChanged}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              dateFormat="h:mm aa"
              timeCaption="Time"
            />
          </Form.Field>
          </Form.Group>
          <div className={`input-wrapper ${this.errorClass(this.state.error.name)}`}>
          <Form.Field>
            <label>Coordinator Name</label>
            <input placeholder='Name'
                   value={this.state.coordinatorName}
                   onChange={this.handleName}
            />
          </Form.Field>
          <div>
            <span>{this.state.error.name || ' ✓'}</span>
          </div>
          </div>
          <div className={`input-wrapper ${this.errorClass(this.state.error.phone)}`}>
          <Form.Field>
            <label>Coordinator Phone</label>
            <input placeholder="Phone"
                   value={this.state.coordinatorPhone}
                   onChange={this.handlePhone}
            />
          </Form.Field>
          <div>
            <span>{this.state.error.phone || ' ✓'}</span>
          </div>
          </div>
          <Button color="green" disabled={!this.state.formValid} type='submit'>Add Event</Button>
         </Form>
        </Segment>
      );
    }
  }
