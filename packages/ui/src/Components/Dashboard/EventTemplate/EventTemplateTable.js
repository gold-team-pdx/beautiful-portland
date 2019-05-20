import React, { Component } from 'react'
import { Form, Button, Header } from 'semantic-ui-react'
import dompurify from 'dompurify'
// Import React Table
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Axios from 'axios'

export default class EventTemplateTable extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      name: '',
      max_signups: 0,
      min_servings: 0,
      min_vegan: 0,
      food: true,
      location: '',
      max_servings: 0
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
        style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data]
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
          this.setState({ data })
        }}
        dangerouslySetInnerHTML={{
          __html: sanitizer(this.state.data[cellInfo.index][cellInfo.column.id])
        }}
      />
    ) 
  }

  render() {
    const { data } = this.state
    var options = [
      { key: 't', text: 'TRUE', value: 'true' },
      { key: 'f', text: 'FALSE', value: 'false' }
    ]
    return (
      <div className="App">
        <Form onSubmit={() => this.handleSubmit()}>
          <Header as="h2">Edit Event Template</Header>
          <Form.Group>
            <Form.Input
              type="text"
              name="name"
              placeholder="type"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <Form.Input
              type="text"
              name="max_signups"
              placeholder="Max Signups"
              value={this.state.max_signups}
              onChange={this.handleChange}
            />
            
            <Form.Input
              type="text"
              name="min_servings"
              placeholder="Minimum servings"
              value={this.state.min_servings}
              onChange={this.handleChange}
            />
            <Form.Input
              type="text"
              name="min_vegan"
              placeholder="Minimum Vegan"
              value={this.state.min_vegan}
              onChange={this.handleChange}
            />
            <Form.Select fluid options={options} placeholder='Food' />
            <Form.Input type="submit" value="Add" />
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
            <Form.Input
              type="text"
              name="location"
              placeholder="Event Location"
              value={this.state.location}
              onChange={this.handleChange}
            />
            <Form.Input
              type="text"
              name="max_servings"
              placeholder="Max Servings"
              value={this.state.max_servings}
              onChange={this.handleChange}
            />
            <Button color="teal" onClick={() => {this.onSubmitTemplate(this.state)}}>SUBMIT</Button>
          </Form.Group>
        </Form>
        
      </div>
    )
  }
}
