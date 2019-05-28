import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import Axios from 'axios'
import { Grid, Modal, Button } from 'semantic-ui-react'
import VolunteerForm from '../Volunteer/VolunteerForm'
import HomeLayout from '../Layouts/HomeLayout'
import CalendarFAQ from '../Home/CalendarFAQ'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

moment.locale('en-GB')
const localizer = BigCalendar.momentLocalizer(moment)
// Sitewide Text Styles
const headerStyles = {
  fontFamily: 'Quicksand',
  fontSize: 'calc(20px + (42 - 20) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))}'
}

const paragraphStyles = {
  fontFamily: 'Quicksand',
  margin: '40px 20px 10px 50px',
  wordWrap: 'break-word',
  justifyContent: 'center',
  fontSize: 'calc(14px + (28 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))'
}

export default class VolunteerCalendar extends Component {
  constructor() {
    super()
    this.state = {
      events: [
        {
          _id: '',
          title: '',
          location: '',
          start: '',
          end: '',
          time: '',
          allDay: false,
          coordinator: '',
          coordinator_phone: ''
        }
      ],
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
    this.setState({ isOpen: false })
  }

  render() {
    return (
      <HomeLayout>
        <div>
          <Grid centered columns={1}>
            <Grid.Row>
              <p style={paragraphStyles}>
                Monday through Friday at 6pm, volunteers from grassroots groups such as Free
                Hot Soup and Just Some Reggae Folk, gather in Director Park (815 SW Park Ave.
                Portland, OR) to share food with Portland area residents experiencing food
                insecurity. Beautiful Portland’s mission is to ease the burden of food insecurity for
                Portland area residents by supporting and sustaining the efforts of food-sharing
                volunteers.
              </p>
            </Grid.Row>
            <Grid.Row>
              <Modal
                trigger={
                  <Button style={{backgroundColor:'#a8efae'}} size='huge'>
                    <p style={{color: '#FFF', textShadow: '0px 0px 4px black'}}>Frequently Asked Questions</p>
                  </Button>
                }
              >
                <Modal.Header style={headerStyles}>Frequently Asked Questions</Modal.Header>
                <Modal.Content>
                  <CalendarFAQ />
                </Modal.Content>
              </Modal>
            </Grid.Row>
            <Grid.Row>
              <div style={{ height: 700, width: 900 }}>
                <BigCalendar
                  localizer={localizer}
                  events={this.state.events}
                  step={30}
                  defaultView="month"
                  views={['month']}
                  defaultDate={new Date()}
                  onSelectEvent={event =>
                    this.setState({
                      eventDay: event.start.format('MM-DD-YY'),
                      isOpen: true
                    })
                  }
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
