import React, { Component } from 'react'
import { Form, Button, Header, Modal, Segment, Input, Icon } from 'semantic-ui-react'
import dompurify from 'dompurify'
// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Axios from 'axios'
import '../../Stylesheets/EventTemplate.css'

export default class EventTemplateTable extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      name: '',
      max_signups: '',
      min_servings: '',
      min_vegan: '',
      food: '',
      location: '',
      max_servings: 0,
      errors: {
        location: '',
        max_servings: '',
        name: '',
        max_signups : '',
        min_servings : '',
        min_vegan : ''
      },
      locationValid: false,
      nameValid: false,
      max_servingsValid: false,
      max_signupsValid: false,
      min_servingsValid: false,
      min_veganValid: false,
      formValid: false,
      submitValid: true,
      blockSubmission: false,
      categoryToDelete:'',
      open: false,
      pin: 2019
    }
  }

  async componentDidMount() {
	  Axios.get('/api/getEventTemplate')
	    .then(res => {
	      let tempEvent_info = JSON.parse(res.data.event_info)
	      this.setState({
	        data: tempEvent_info,
	        location: res.data.location,
	        max_servings: res.data.max_servings
	      })
	    })
	    .catch(err => {
	      console.log(err, 'Error Retrieving Template Information')
	    })
  }
  
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    this.validateField(e.target.name, e.target.value)
  }

  handleSubmit = async (event) => {
    const { name, max_signups, min_servings, min_vegan, food, data} = this.state
    var nameObj = {'name': name, 'max_signups': parseInt(max_signups,10), 'min_servings' : Number(min_servings), 'min_vegan': Number(min_vegan), 'food': food}
    data.push(nameObj)
    this.setState({ data })
  }

  onSubmitTemplate = (data, submitValid) => {
    if(!submitValid){
      this.setState({blockSubmission: true})
    } else {
      this.setState({blockSubmission: false})
	  Axios.post('/api/editEventTemplate', data)
	    .then(response => {
	      console.log('Template Submitted')
	    })
	    .catch(err => {
	      console.log(err, 'Try again.')
        })
    }
  }

  deleteEvent = (event) => {
    const deletedEventTemplate = {category: event}
    console.log(deletedEventTemplate)
    Axios.post('/api/deleteEventTemplate', deletedEventTemplate)
      .then((response) => {
        console.log('Deleted Event')
      })
      .catch((err) => {
        console.log(err, 'Try again.')
      })
  }

  emergencyRefresh = () => {
    Axios.post('/api/emergencyRefresh')
      .then((response) => {
        console.log('Template set to original state')
      })
      .catch((err) => {
        console.log(err, 'Could not reset template')
      })
  }
  

  renderEditable = cellInfo => {
    let sanitizer = dompurify.sanitize
    return (
      <div
        style={{ backgroundColor: '#fafafa', textAlign: 'center'}}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data]
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
          this.setState({ data })
        }}
        dangerouslySetInnerHTML={{
          __html: sanitizer(this.state.data[cellInfo.index][cellInfo.column.id].toString())
        }}
      />
    ) 
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
      min_servingsValid = value > 0 
      errors.min_servings = min_servingsValid ? '' : ' ✗ Please enter a valid number between 0~' + this.props.max_servings + '.'
      break
    case 'min_vegan':
      min_veganValid = value < this.state.max_servings/3
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
      this.state.nameValid &&
      this.state.max_signupsValid &&
      this.state.min_servingsValid &&
      this.state.min_veganValid
    })
  }

  errorClass(error) {
    return error.length === 0 ? '' : 'has-error'
  }

  onDropdownChange = (e, data) => {
    const {name, value} = data
    this.setState({ [name]: value })
  }

  handleClose = () => this.setState({ open: false })

  render() {
    const { data } = this.state
    var options = [
      { key: 't', text: 'true', value: 'true' },
      { key: 'f', text: 'false', value: 'false' }
    ]
    let submitValid = this.state.submitValid
    return (
      <div>
        <Header as="h2">Edit Master Event Template</Header>
        <Segment>
          <Form onSubmit={() => this.handleSubmit()}>
            <Form.Group>
              <div className={`input-wrapper ${this.errorClass(this.state.errors.name)}`}>
                <Form.Input
                  type="text"
                  name="name"
                  placeholder="type"
                  value={this.state.name}
                  onChange={this.onChange}
                />
                <div>
                  <span>{this.state.errors.name || ' ✓'}</span>
                </div>
              </div>
              <div className={`input-wrapper ${this.errorClass(this.state.errors.max_signups)}`}>
                <Form.Input
                  type="text"
                  name="max_signups"
                  placeholder="Max Signups"
                  value={this.state.max_signups}
                  onChange={this.onChange}
                />
                <div>
                  <span>{this.state.errors.max_signups || ' ✓'}</span>
                </div>
              </div>
              <div className={`input-wrapper ${this.errorClass(this.state.errors.min_servings)}`}>
                <Form.Input
                  type="text"
                  name="min_servings"
                  placeholder="Minimum servings"
                  value={this.state.min_servings}
                  onChange={this.onChange}
                />
                <div>
                  <span>{this.state.errors.min_servings || ' ✓'}</span>
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <div className={`input-wrapper ${this.errorClass(this.state.errors.min_vegan)}`}>
                <Form.Input
                  type="text"
                  name="min_vegan"
                  placeholder="Minimum Vegan"
                  value={this.state.min_vegan}
                  onChange={this.onChange}
                />
                <div>
                  <span>{this.state.errors.min_vegan || ' ✓'}</span>
                </div>
              </div>
            
              <Form.Select  
                name="food"
                placeholder="Food"
                onChange={this.onDropdownChange} 
                options={options}/>
              <Form.Input type="submit" value="Add" disabled={!this.state.formValid}/>
            </Form.Group>
          </Form>
          <div>
            <ReactTable
              data={data}
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                  Cell: this.renderEditable,
                  getProps: (state, rowInfo, column) => {
                    if(!rowInfo){
                      return {} 
                    } else {
                      let nameError = rowInfo.row.name.length < 2
                      if(nameError) 
                        submitValid = false
                      return {
                        style: {
                          color: nameError ? 'red' : null,
                        }
                      }
                    }
                  }
                },
                {
                  Header: 'Maximum # Signups',
                  accessor: 'max_signups',
                  Cell: this.renderEditable,
                  getProps: (state, rowInfo, column) => {
                    if(!rowInfo){
                      return {} 
                    } else {
                      let signupError = rowInfo.row.max_signups < 1 || isNaN(rowInfo.row.max_signups)
                      if(signupError) 
                        submitValid = false
                      return {
                        style: {
                          color: signupError ? 'red' : null,
                        }
                      }
                    }
                  }
                },
                {
                  Header: 'Minimum # Servings',
                  accessor: 'min_servings',
                  Cell: this.renderEditable,
                  getProps: (state, rowInfo, column) => {
                    if(!rowInfo){
                      return {} 
                    } else {
                      let servingsError = rowInfo.row.min_servings < 1 || isNaN(rowInfo.row.min_servings)
                      if(servingsError) 
                        submitValid = false
                      return {
                        style: {
                          color: servingsError ? 'red' : null,
                        }
                      }
                    }
                  }
                },
                {
                  Header: 'Minimum # Vegan',
                  accessor: 'min_vegan',
                  Cell: this.renderEditable,
                  getProps: (state, rowInfo, column) => {
                    if(!rowInfo){
                      return {} 
                    } else {
                      let veganError = rowInfo.row.min_vegan < 0 || isNaN(rowInfo.row.min_vegan)
                      if(veganError) 
                        submitValid = false
                      return {
                        style: {
                          color: veganError ? 'red' : null,
                        }
                      }
                    }
                  }
                },
                {
                  Header: 'Food',
                  accessor: 'food',
                  Cell: this.renderEditable,
                  getProps: (state, rowInfo, column) => {
                    if(!rowInfo){
                      return {} 
                    } else {
                      let checkFood = rowInfo.row.food.toString()
                      let foodError = checkFood !== 'true' && checkFood !== 'false'
                      if(foodError) 
                        submitValid = false
                      return {
                        style: {
                          color: foodError ? 'red' : null,
                        }
                      }
                    }
                  }
                },
                {
                  Header: 'Remove',
                  accessor: 'remove',
                  Cell: (row)=> (
                    <Modal 
                      trigger={
                        <Button color="red" onClick={() => this.setState({open: true})}>Remove</Button>} 
                      open={this.state.open}
                      onClose={this.handleClose}> 
                      <Modal.Header>Refresh Event Template</Modal.Header>
                      <Modal.Content>
                        <Modal.Description>
                          <Header as="h2">Are you sure you want to delete this category?</Header>
                          <Button color="green"
                            onClick={() => {
                              let data = this.state.data
                              this.deleteEvent(this.state.data[row.index].name)
                              data.splice(row.index, 1)
                              this.setState({data})  
                              this.setState({open: false})
                            }}
                          ><Icon name="checkmark" />Yes</Button>
                          <Button color="red" onClick={this.handleClose}>
                            <Icon name="remove" />No</Button>
                        </Modal.Description>
                      </Modal.Content>
                    </Modal>
                  ) 
                }
              ]}
              defaultPageSize={10}
              className="-highlight"
            />
          </div>
          <Form style={{marginTop: '2%'}}>  
            <Form.Group>
              <div className={`input-wrapper ${this.errorClass(this.state.errors.location)}`}>
                <Form.Input
                  type="text"
                  name="location"
                  placeholder="Event Location"
                  value={this.state.location}
                  onChange={this.onChange}
                />
                <div>
                  <span>{this.state.errors.location || ' ✓'}</span>
                </div>
              </div>
              <div className={`input-wrapper ${this.errorClass(this.state.errors.max_servings)}`}>
                <Form.Input
                  type="text"
                  name="max_servings"
                  placeholder="Max Servings"
                  value={this.state.max_servings}
                  onChange={this.onChange}
                />
                <div>
                  <span>{this.state.errors.max_servings || ' ✓'}</span>
                </div>
              </div>
            
            </Form.Group>
            <Modal trigger={
              <Button color="teal" onClick={() => {this.onSubmitTemplate(this.state,submitValid)}} disabled={(!(this.state.location && this.state.max_servings))}>Update</Button> }>
              <Modal.Header>Edit Master Event Template</Modal.Header>
              <Modal.Content>  
                <Modal.Description>
                  {
                    this.state.blockSubmission ?
                      <Header color="red" as="h1">There are errors in your event template. Your template was not submitted</Header>
                      : <Header color="green" as="h1">Your changes to the Master Event Template have been submitted</Header>
                  }
                </Modal.Description>
              </Modal.Content>
            </Modal>
          </Form>
          <Modal trigger={
            <Button color="red">Template Refresh</Button> }>
            <Modal.Header>Emergency Template Refresh</Modal.Header>
            <Modal.Content>  
              <Modal.Description>
                <Header as="h2">This action cannot be undone. Enter PIN to continue:</Header>
                <Input type="text" placeholder="pin"/>
                <Button.Group>
                  <Button>Cancel</Button>
                  <Button.Or />
                  <Button positive>Save</Button>
                </Button.Group>
                {
                  this.state.blockSubmission ?
                    <Header color="red" as="h1">There are errors in your event template. Your template was not submitted</Header>
                    : <Header color="green" as="h1">Your changes to the Master Event Template have been submitted</Header>
                }
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Segment>
      </div>
    )
  }
}
