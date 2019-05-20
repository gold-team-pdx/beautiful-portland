import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Menu, Header, Segment, Button, Image } from 'semantic-ui-react'
import Axios from 'axios'
import WelcomeMessage from './WelcomeMessage'
import Moment from 'moment'
import '../Stylesheets/AdminDashboard.css'
import logo from '../../logoPhotos/bpdx_horizontallogo_white.png'
import DashMenu from './DashMenu'
import EditEventTemplate from './EventTemplate/EditEventTemplate'
import AddEvent from './AddEvent'
import UpcomingEvents from './UpcomingEvents'
import VolunteerList from './VolunteerList'
import EditCarouselImages from './Images/EditCarouselImages'
import ViewAllImages from './Images/ViewAllImages'
import NewStory from './Stories/NewStory'
import ViewStories from './Stories/ViewStories'
import EditEvent from './EditEvent'
import EditStory from './Stories/EditStory'
import VolunteerSubmissions from './VolunteerSubmissions'
import EventTemplateTable from './EventTemplate/EventTemplateTable'
import EditContent from './EditContent'
import EditCalendarFAQ from './EditCalendarFAQ'

export default class AdminDashboard extends Component {
  state = {
    // Default active content
    activeItem: 'welcomeMessage',
    activeDate: new Moment().format('MM-DD-YY'),
    activeEmail: '',
    adminName: 'Anonymous',
    authenticated: false,
    message: 'Please Login',
    editId: '0000'
  }
  async componentDidMount() {
    //Need to generate and fill volunteer list from databases
    Axios.get('/api/admin-dashboard')
      .then(res => {
        this.setState({
          adminName: res.data.userInfo.displayName,
          authenticated: res.data.authenticated,
          message: res.data.message
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  updateActiveDate = date => {
    this.setState({
      activeDate: date,
      activeItem: 'editEvent'
    })
  }

  updateActiveEmail = email => {
    this.setState({
      activeEmail: email,
      activeItem: 'volunteerSubmissions'
    })
  }

  updateGrandparent = e => this.setState({ activeItem: 'editStory' })

  updateGrandparentID = async value => {
    await this.setState({ editId: value })
    await console.log(this.state.editId)
  }

  loginPrompt = () => {
    return (
      <Segment placeholder>
        <Header as="h3" textAlign="center">
          {this.state.message}
          <br />
          <Button.Group>
            <a href="/" style={{ color: 'white' }}>
              <Button positive>Home</Button>
            </a>
            <Button.Or />
            <a href="/login" style={{ color: 'white' }}>
              <Button primary>Login</Button>
            </a>
          </Button.Group>
        </Header>
      </Segment>
    )
  }

  viewEvents = () => {
    return <UpcomingEvents updateActiveDate={this.updateActiveDate} />
  }

  viewStories = () => {
    return (
      <ViewStories
        updateGrandparent={this.updateGrandparent}
        edit={this.state.activeItem}
        updateGrandparentID={this.updateGrandparentID}
        editId={this.state.editId}
      />
    )
  }

  editCalendarFAQ = () => {
    return <EditCalendarFAQ />
  }

  volunteerList = () => {
    return <VolunteerList updateActiveEmail={this.updateActiveEmail} />
  }

  volunteerSubmissions = () => {
    return <VolunteerSubmissions email={this.state.activeEmail} />
  }

  editEvent = () => {
    return <EditEvent date={this.state.activeDate} />
  }

  editStory = () => {
    return <EditStory editId={this.state.editId} />
  }

  render() {
    const { activeItem } = this.state

    if (!this.state.authenticated) {
      return (
        <HashRouter>
          <div>
            <Menu size="huge" inverted color="teal">
              <Menu.Item>
                <Image src={logo} size="small" />
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  {/* We could change this to be whichever user is logged in */}
                  Hi {this.state.adminName}
                </Menu.Item>
                <Menu.Item
                  name="logout"
                  active={activeItem === 'logout'}
                  onClick={this.handleItemClick}
                >
                  Logout
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Route path="/" component={this.loginPrompt} />
          </div>
        </HashRouter>
      )
    }

    return (
      <HashRouter>
        <div className="adminDash">
          <Menu size="huge" inverted color="teal">
            <Menu.Item>
              <Image src={logo} size="small" />
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                {/* We could change this to be whichever user is logged in */}
                Hi {this.state.adminName}
              </Menu.Item>
              <Menu.Item
                name="logout"
                active={activeItem === 'logout'}
                onClick={this.handleItemClick}
              >
                Logout
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <div className="adminView">
            <DashMenu />
            {/* <Header as='h1'> {this.state.message} </Header> */}
            {/* Changed these to divs so we can work some CSS magic on them */}
            <div className="adminPageContent">
              <Route exact path="/" component={WelcomeMessage} />
              <Route path="/EditEventTemplate" component={EventTemplateTable} />
              <Route path="/AddEvent" component={AddEvent} />
              <Route path="/ViewUpcomingEvents" component={this.viewEvents} />
              <Route path="/EditEvent" component={this.editEvent} />
              <Route path="/EditCalendarFAQ" component={this.editCalendarFAQ} />
              <Route path="/VolunteerList" component={this.volunteerList} />
              <Route path="/EditContent" component={EditContent} />
              <Route
                path="/VolunteerSubmissions"
                component={this.volunteerSubmissions}
              />
              <Route path="/EditImages" component={EditCarouselImages} />
              <Route path="/ViewImages" component={ViewAllImages} />
              <Route path="/CreateStory" component={NewStory} />
              <Route path="/ViewStories" component={this.viewStories} />
              <Route path="/EditStory" component={this.editStory} />
            </div>
          </div>
        </div>
      </HashRouter>
    )
  }
}
