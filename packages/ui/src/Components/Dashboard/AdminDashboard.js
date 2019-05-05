import React, { Component } from 'react'
import { Menu, Header, Segment, Button, Image } from 'semantic-ui-react'
import Axios from 'axios'
import WelcomeMessage from './WelcomeMessage'
import Moment from 'moment'
import '../Stylesheets/AdminDashboard.css'
import logo from '../../logoPhotos/bpdx_horizontallogo_white.png'
import DashMenu from './DashMenu'

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
      .then((res) => {
        this.setState({
          adminName: res.data.userInfo.displayName,
          authenticated: res.data.authenticated,
          message: res.data.message
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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

  render() {
    const { activeItem } = this.state

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
              active={activeItem === "logout"}
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
            <WelcomeMessage />
          </div>
        </div>
      </div>
    )
  }
}
