import React, { Component } from 'react'
import { Form, Button, Header } from 'semantic-ui-react'
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
      food: true,
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
      categoryToDelete:'',
      open: false
    }
  }

  async componentDidMount() {
	  Axios.get('/api/getEventTemplate')
	    .then(res => {
	      // console.log(res.data)
	      // console.log(res.data.event_info)
	      // console.log(res.data.location)
	      // console.log(res.data.time)
	      let tempEvent_info = JSON.parse(res.data.event_info)
	      console.log(tempEvent_info)
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

  handleChange = event => {
    if (event.target.name === 'name') 
      this.setState({name: event.target.value})  
    if (event.target.name === 'max_signups')
      this.setState({max_signups: event.target.value})
    if (event.target.name === 'min_servings')
      this.setState({min_servings: event.target.value})
    if (event.target.name === 'min_vegan')
      this.setState({min_vegan: event.target.value})
    if (event.target.name === 'food')
      this.setState({food: event.target.value})
    if (event.target.name === 'location')
      this.setState({location: event.target.value})
    if (event.target.name === 'max_servings')
      this.setState({max_servings: event.target.value})
  }
  
  handleSubmit = async (event) => {
    const { name, max_signups, min_servings, min_vegan, food, data} = this.state
    var nameObj = {'name': name, 'max_signups': parseInt(max_signups,10), 'min_servings' : Number(min_servings), 'min_vegan': Number(min_vegan), 'food': food}
    data.push(nameObj)
    this.setState({ data })
    
    /*await this.setState({ data: data })*/
    console.log(data)
  }

  onSubmitTemplate = data => {
	  console.log(data)
	  Axios.post('/api/editEventTemplate', data)
	    .then(response => {
	      console.log(response, 'Template Submitted')
	    })
	    .catch(err => {
	      console.log(err, 'Try again.')
	    })
  }

  deleteEvent = (event) => {
    const deletedEventTemplate = {category: event}
    console.log(deletedEventTemplate)
    Axios.post('/api/deleteEventTemplate', deletedEventTemplate)
      .then((response) => {
        console.log(response, 'Deleted Event ' + event)
      })
      .catch((err) => {
        console.log(err, 'Try again.')
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
    console.log(fieldName + ' ' + value)
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

  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })


  render() {
    const { data } = this.state
    var options = [
      { key: 't', text: 'TRUE', value: 'true' },
      { key: 'f', text: 'FALSE', value: 'false' }
    ]
    return (
      <div>
        <Form onSubmit={() => this.handleSubmit()}>
          <Header as="h2">Edit Master Event Template</Header>
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
            <Form.Select fluid options={options} placeholder='Food' />
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
                Cell: this.renderEditable
              },
              {
                Header: 'Maximum # Signups',
                accessor: 'max_signups',
                Cell: this.renderEditable
              },
              {
                Header: 'Minimum # Servings',
                accessor: 'min_servings',
                Cell: this.renderEditable
              },
              {
                Header: 'Minimum # Vegan',
                accessor: 'min_vegan',
                Cell: this.renderEditable
              },
              {
                Header: 'Food',
                accessor: 'food',
                Cell: this.renderEditable
              },
              {
                Header: 'Remove',
                accessor: 'remove',
                Cell: (row)=> (
                  <Button color="red" size="tiny" icon="remove" 
                    onClick={() => {
                      let data = this.state.data
                      console.log(this.state.data[row.index].name)
                      this.deleteEvent(this.state.data[row.index].name)
                      data.splice(row.index, 1)
                      this.setState({data})  
                    }}/>
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
          <Button color="teal" onClick={() => {this.onSubmitTemplate(this.state)}}>Update</Button>
        </Form>
        
      </div>
    )
  }
}