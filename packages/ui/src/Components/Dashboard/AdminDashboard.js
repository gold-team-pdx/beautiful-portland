import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Menu, Header, Segment, Button, Image } from 'semantic-ui-react'
import Axios from 'axios'
import WelcomeMessage from './WelcomeMessage'
import Moment from 'moment'
import '../Stylesheets/AdminDashboard.css'
import logo from '../../logoPhotos/bpdx_horizontallogo_white.png'
import DashMenu from './DashMenu'
import EditEventTemplate from './EventTemplate/EditEventTemplate';
import AddEvent from './AddEvent'
import UpcomingEvents from './UpcomingEvents'
import VolunteerList from './VolunteerList'
import EditCarouselImages from './Images/EditCarouselImages'
import ViewAllImages from './Images/ViewAllImages'
import NewStory from './Stories/NewStory'
import ViewStories from './Stories/ViewStories'
import EditEvent from './EditEvent'
<<<<<<< HEAD
import VolunteerSubmissions from './VolunteerSubmissions'
import Moment from 'moment'
import UpcomingEvents from './UpcomingEvents'
import EditEventTemplate from './EventTemplate/EditEventTemplate'
import '../Stylesheets/AdminDashboard.css'
import logo from '../../logoPhotos/bpdx_horizontallogo_white.png'
=======
import EditStory from './Stories/EditStory'
>>>>>>> 7dea67e693dabc84726f64fd705e0e2af938b6fc

export default class AdminDashboard extends Component {
  state = {
    // Default active content
    activeItem: 'welcomeMessage',
    activeDate: new Moment().format('MM-DD-YY'),
    adminName: 'Anonymous',
    authenticated: false,
    message: 'Please Login',
    editId: '0000'
  }
  async componentDidMount() {
    //Need to generate and fill volunteer list from databases
    Axios.get('/api/admin-dashboard')
<<<<<<< HEAD
      .then(res => {
=======
      .then((res) => {
>>>>>>> 7dea67e693dabc84726f64fd705e0e2af938b6fc
        this.setState({
          adminName: res.data.userInfo.displayName,
          authenticated: res.data.authenticated,
          message: res.data.message
        })
      })
<<<<<<< HEAD
      .catch(err => {
=======
      .catch((err) => {
>>>>>>> 7dea67e693dabc84726f64fd705e0e2af938b6fc
        console.log(err)
      })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
<<<<<<< HEAD

  updateActiveDate = date => {
    this.setState({
      activeDate: date,
      activeItem: 'editEvent'
    })
  }

  updateGrandparent = e => this.setState({ activeItem: 'editStory' })

  updateGrandparentID = async value => {
    await this.setState({ editId: value })
    await console.log(this.state.editId)
  }

  render() {
    const { activeItem } = this.state
    // Add more components to be rendered here
    const itemsToRender = {
      volunteerList: <VolunteerList />,
      editCarouselImages: <EditCarouselImages />,
      viewAllImages: <ViewAllImages />,
      addEvent: <AddEvent />,
      newStory: <NewStory />,
      viewEvents: <UpcomingEvents updateActiveDate={this.updateActiveDate} />,
      editEvent: <EditEvent date={this.state.activeDate} />,
      volunteerSubmissions: <VolunteerSubmissions />,
      welcomeMessage: <WelcomeMessage />,
      viewStories: (
        <ViewStories
          updateGrandparent={this.updateGrandparent}
          edit={this.state.activeItem}
          updateGrandparentID={this.updateGrandparentID}
          editId={this.state.editId}
        />
      ),
      editStory: <EditStory editId={this.state.editId} />,
      editEventTemplate: <EditEventTemplate />
    }

    if (!this.state.authenticated) {
      return (
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
        </div>
      )
    }

    return (
=======

  updateActiveDate = (date) => {
    this.setState({
      activeDate: date,
      activeItem: 'editEvent'
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
    return (
      <UpcomingEvents updateActiveDate={this.updateActiveDate} />
    )
  }

  viewStories = () => {
    return (
      <ViewStories
        updateGrandparent={this.updateGrandparent}
        edit={this.state.activeItem}
        updateGrandparentID={this.updateGrandparentID}
        editId={this.state.editId} />
    )
  }

  editEvent = () => {
    return (
      <EditEvent date={this.state.activeDate} />
    )
  }

  editStory = () => {
    return (
      <EditStory editId={this.state.editId} />
    )
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
>>>>>>> 7dea67e693dabc84726f64fd705e0e2af938b6fc
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
<<<<<<< HEAD
              active={activeItem === 'logout'}
=======
              active={activeItem === "logout"}
>>>>>>> 7dea67e693dabc84726f64fd705e0e2af938b6fc
              onClick={this.handleItemClick}
            >
              Logout
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div className="adminView">
<<<<<<< HEAD
          <div className="dashMenu">
            <Menu vertical size="huge">
              <Menu.Item name="events">Events</Menu.Item>
              <Menu.Menu>
                <Menu.Item
                  name="editEventTemplate"
                  active={activeItem === 'editEventTemplate'}
                  onClick={this.handleItemClick}
                >
                  Edit Event Template
                </Menu.Item>
                <Menu.Item
                  name="addEvent"
                  active={activeItem === 'addEvent'}
                  onClick={this.handleItemClick}
                >
                  Add Event
                </Menu.Item>
                <Menu.Item
                  name="viewEvents"
                  active={activeItem === 'viewEvents'}
                  onClick={this.handleItemClick}
                >
                  View Upcoming Events
                </Menu.Item>
              </Menu.Menu>
              <Menu.Item
                name="volunteerList"
                active={activeItem === 'volunteerList'}
                onClick={this.handleItemClick}
              >
                Volunteer List
              </Menu.Item>
              <Menu.Item name="Images">Images</Menu.Item>
              <Menu.Menu>
                <Menu.Item
                  name="editCarouselImages"
                  active={activeItem === 'editCarouselImages'}
                  onClick={this.handleItemClick}
                >
                  Edit Front Page Images
                </Menu.Item>
                <Menu.Item
                  name="viewAllImages"
                  active={activeItem === 'viewAllImages'}
                  onClick={this.handleItemClick}
                >
                  View All Images
                </Menu.Item>
              </Menu.Menu>
              <Menu.Item name="stories">Stories</Menu.Item>
              <Menu.Menu>
                <Menu.Item
                  name="newStory"
                  active={activeItem === 'newStory'}
                  onClick={this.handleItemClick}
                >
                  Create Story
                </Menu.Item>
                <Menu.Item
                  name="viewStories"
                  active={activeItem === 'viewStories'}
                  onClick={this.handleItemClick}
                >
                  View Stories
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </div>
          {/* <Header as='h1'> {this.state.message} </Header> */}
          {/* Changed these to divs so we can work some CSS magic on them */}
          <div className="adminPageContent">
            {
              /* Whichever menu item is active will be the content that is shown */
              itemsToRender[this.state.activeItem.toString()]
            }
          </div>
        </div>
      </div>
=======
          <DashMenu />
          {/* <Header as='h1'> {this.state.message} </Header> */}
          {/* Changed these to divs so we can work some CSS magic on them */}
            <div className="adminPageContent">
              <Route exact path="/" component={WelcomeMessage} />
              <Route
                path="/EditEventTemplate"
                component={EditEventTemplate}
              />
              <Route path="/AddEvent" component={AddEvent} />
              <Route
                path="/ViewUpcomingEvents"
                component={this.viewEvents}
              />
              <Route
                path="/EditEvent"
                component={this.editEvent}
              />
              <Route
                path="/VolunteerList"
                component={VolunteerList}
              />
              <Route
                path="/EditImages"
                component={EditCarouselImages}
              />
              <Route
                path="/ViewImages"
                component={ViewAllImages}
              />
              <Route path="/CreateStory" component={NewStory} />
              <Route
                path="/ViewStories"
                component={this.viewStories}
              />
              <Route
                path="/EditStory"
                component={this.editStory}
              />
          </div>
        </div>
        </div>
        </HashRouter>
>>>>>>> 7dea67e693dabc84726f64fd705e0e2af938b6fc
    )
  }
}
