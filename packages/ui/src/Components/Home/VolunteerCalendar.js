import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import Axios from 'axios'
import { Grid, Modal } from 'semantic-ui-react'
import VolunteerForm from '../Volunteer/VolunteerForm'
import HomeLayout from '../Layouts/HomeLayout'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
moment.locale('en-GB')
const localizer = BigCalendar.momentLocalizer(moment)


export default class VolunteerCalendar extends Component {
  constructor(){
    super()
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
      }],
      eventDay: '',
      CURRENT: new moment().format('LL'),
      isOpen: false
    }
  }

    componentDidMount = () => {
      Axios.get('/api/eventCalendar')
        .then(res => {
          let calendars = []
          if (res.data['event_info']) {
            let data = JSON.parse(res.data['event_info'])
            calendars = data.map(calendar => {
              calendar.start = moment(calendar.start, 'MM-DD-YY')
              calendar.end = moment(calendar.end, 'MM-DD-YY')
              return calendar
            })
            this.setState({ events: calendars })
          }
        })
        .catch(err => {
          console.log(err, 'Error Retrieving Events')
        })
    }

    handleClose = () => {
      this.setState({isOpen: false})
    }

    render() {
      return (
        <HomeLayout>
          <div> 
            <Grid centered columns={1}>
            
              <Grid.Row>
                <div style={{ height: 700, width: 900}}>
                  <BigCalendar
                    localizer={localizer}
                    events={this.state.events}
                    step={30}
                    defaultView='month'
                    views={['month']}
                    defaultDate={new Date()}
                    onSelectEvent={event => this.setState({eventDay: event.start.format('MM-DD-YY'), isOpen: true  })}
                    eventPropGetter={event => ({
                      style: {
                        backgroundColor: event.start.isBefore(this.state.CURRENT)
                          ? '#808080'
                          : '#3174ad',
                        pointerEvents: event.start.isBefore(this.state.CURRENT)
                          ? 'none'
                          : 'auto'
                      }
                    })}
                  />
                </div>
              </Grid.Row>
             
            </Grid>
            <Modal open={this.state.isOpen} onClose={this.handleClose}>
              <Modal.Content>
                <VolunteerForm date={this.state.eventDay} />
              </Modal.Content>
            </Modal>
          </div>
        </HomeLayout>
      )
    }
}
