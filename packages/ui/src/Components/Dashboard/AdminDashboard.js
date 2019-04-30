import React, { Component } from 'react'
import { Menu, Header, Segment, Button } from 'semantic-ui-react'
import Axios from 'axios'
import VolunteerList from './VolunteerList'
import AddEvent from './AddEvent'
import NewStory from './Stories/NewStory'
import ViewStories from './Stories/ViewStories'
import WelcomeMessage from './WelcomeMessage'
import EditStory from './Stories/EditStory'
import '../Stylesheets/AdminDashboard.css'


export default class AdminDashboard extends Component {
    state = {
        // Default active content
        activeItem: 'welcomeMessage',
        adminName: "Anonymous",
        authenticated: false,
        message: "Please Login",
        storyObj: {
          _id: '',
          edited_timestamp: '',
          title : '',
          hook : '',
          content : '',
          published_status : false
        }
    }
    async componentDidMount () {
        //Need to generate and fill volunteer list from databases
        Axios.get('/api/admin-dashboard')
        .then(res => {
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

    updateGrandparent = (e) => {
      this.setState({activeItem : 'editStory'})
    }

    passStoryGrandparent = (value) => {
      this.setState({
        storyObj: {
          ...this.state.storyObj,
        _id: value._id,
        edited_timestamp: value.edited_timestamp,
        title: value.title,
        hook: value.hook,
        content: value.Content,
        published_status: value.published_status}
      })
    }

    handleItemClick = (e, { name }) => this.setState({activeItem: name})

    render() {
        const { activeItem } = this.state
        // Add more components to be rendered here
        const itemsToRender = {'volunteerList': <VolunteerList />, 'addEvent': <AddEvent />,
                               'newStory': <NewStory />, 'welcomeMessage' : <WelcomeMessage />,
                               'viewStories' : <ViewStories edit={this.state.activeItem}
                                                passStoryGrandparent={this.passStoryGrandparent}
                                                story={this.state.storyObj}
                                                updateGrandparent={this.updateGrandparent}/>,
                                'editStory' : <EditStory /> }

        if (!this.state.authenticated){
            return(
                <div>
                <Menu size='huge' inverted color='teal'>
                    <Menu.Item>
                        Logo Here?
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            {/* We could change this to be whichever user is logged in */}
                            Hi {this.state.adminName}
                        </Menu.Item>
                        <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleItemClick}>
                            Logout
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Segment placeholder>
                    <Header as='h3' textAlign='center' >{this.state.message}
                    <br />
                    <Button.Group>
                        <a href='/' style={{color:"white"}}><Button positive>Home</Button></a>
                        <Button.Or />
                        <a href='/login' style={{color:"white"}}><Button primary>Login</Button></a>
                    </Button.Group>
                    </Header>
                </Segment>
                </div>
            )
        }

        return (
            <div className='adminDash'>
                    <Menu size='huge' inverted color='teal'>
                        <Menu.Item>
                            Logo Here?
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                {/* We could change this to be whichever user is logged in */}
                                Hi {this.state.adminName}
                            </Menu.Item>
                            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleItemClick}>
                                Logout
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                <div className='adminView'>
                    <div className='dashMenu'>
                        <Menu vertical size='huge'>
                            <Menu.Item name='events'>
                                Events
                            </Menu.Item>
                            <Menu.Menu>
                                <Menu.Item name='addEvent' active={activeItem === 'addEvent'} onClick={this.handleItemClick}>
                                    Add Event
                                </Menu.Item>
                                <Menu.Item name='viewEvents' active={activeItem === 'viewEvents'} onClick={this.handleItemClick}>
                                    View Upcoming Events
                                </Menu.Item>
                            </Menu.Menu>
                            <Menu.Item name='volunteerList' active={activeItem === 'volunteerList'} onClick={this.handleItemClick}>
                                Volunteer List
                            </Menu.Item>
                            <Menu.Item name='Images'>
                                Images
                            </Menu.Item>
                            <Menu.Menu>
                                <Menu.Item name='addImages' active={activeItem === 'addImages'} onClick={this.handleItemClick}>
                                    Add Image
                                </Menu.Item>
                                <Menu.Item name='removeImages' active={activeItem === 'removeImages'} onClick={this.handleItemClick}>
                                    Remove Image
                                </Menu.Item>
                            </Menu.Menu>
                            <Menu.Item name='stories'>
                                Stories
                            </Menu.Item>
                            <Menu.Menu>
                                <Menu.Item name='newStory' active={activeItem === 'newStory'} onClick={this.handleItemClick}>
                                    Create Story
                                </Menu.Item>
                                <Menu.Item name='viewStories' active={activeItem === 'viewStories'} onClick={this.handleItemClick}>
                                    View Stories
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    </div>

                    {/* Changed these to divs so we can work some CSS magic on them */}
                    <div className='adminPageContent'>
                    {
                        /* Whichever menu item is active will be the content that is shown */
                        itemsToRender[this.state.activeItem.toString()]
                    }
                    </div>
                </div>
            </div>
        )
    }
}
