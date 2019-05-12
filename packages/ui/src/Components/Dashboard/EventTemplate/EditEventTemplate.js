import React, { Component } from 'react'
import EventTemplate from './EventTemplate'
import { Header } from 'semantic-ui-react'
import Axios from 'axios'

export default class EditEventTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      event_info: [],
      location: '',
      time: '',
      max_servings: 0
    }

  }
	onSubmit = data => {
	  console.log(data)
	  Axios.post('/api/editEventTemplate', data)
	    .then(response => {
	      console.log(response, 'Template Submitted')
	    })
	    .catch(err => {
	      console.log(err, 'Try again.')
	    })
	  window.location.reload()
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
	        event_info: tempEvent_info,
	        location: res.data.location,
	        time: res.data.time,
	        max_servings: res.data.max_servings
	      })
	    })
	    .catch(err => {
	      console.log(err, 'Error Retrieving Template Information')
	    })
	}

	render() {
	  return (
	    <div>
	      <Header as="h1">Edit Event Template</Header>
	      {/* <Form onSubmit={this.onSubmit}> */}
	      {this.state.event_info.map((item)=>{
	        return(
	          <EventTemplate
	            key={item.name}
	            event_info={item}
	            location={this.state.location}
	            time={this.state.time}
	            max_servings={this.state.max_servings}
	            onSubmit={this.onSubmit}
	          />
	        )
	      })}
	    </div>
	  )
	}
}