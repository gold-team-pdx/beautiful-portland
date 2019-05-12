import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import Axios from 'axios'
import { Grid, Header } from 'semantic-ui-react'
import VolunteerForm from '../Volunteer/VolunteerForm'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
moment.locale('en-GB');
const localizer = BigCalendar.momentLocalizer(moment);


export default class VolunteerCalendar extends Component {
    constructor(){
      super();
      this.state = {
        events: [{
            _id: '',
            title: '',
            location: '',
            start: '',
            end: '',
            time: '',
            allDay: false,
            coordinator: '',
            coordinator_phone: ''

        }]
      }
    }

    componentDidMount = () => {
        Axios.get('/api/eventCalendar')
        .then(res => {
            let calendars = []
            if (res.data["event_info"]) {
              let data = JSON.parse(res.data["event_info"])
              data.map(calendar => calendars.push(calendar))
              this.setState({ events: calendars })
            }
          })
          .catch(err => {
            console.log(err, "Error Retrieving Events")
          })
    }
  
    render() {
      return (
        <div style={{marginTop: 30}}> 
          <Grid centered columns={1}>
             <Grid.Row>
                <Header as="h1">Volunteer Calendar</Header>
             </Grid.Row>
             <Grid.Row>
               <div style={{ height: 700, width: 900}}>
                  <BigCalendar
                    localizer={localizer}
                    events={this.state.events}
                    step={30}
                    defaultView='month'
                    views={['month']}
                    defaultDate={new Date()}
                   />
                </div>
             </Grid.Row>
            </Grid>
        </div>
      )
    }
  }
