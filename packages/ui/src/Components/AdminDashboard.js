import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import VolunteerList from './VolunteerList'
import './Stylesheets/AdminDashboard.css'

export default class AdminDashboard extends Component {
    state = {
        // Default active content
        activeItem: 'viewEvents'
    }

    handleItemClick = (e, { name }) => this.setState({activeItem: name})
    
    render() {
        const { activeItem } = this.state
        const itemsToRender = {'volunteerList': <VolunteerList />}
        return (
            <div className='adminDash'>
                    <Menu size='huge' inverted color='teal'>
                        <Menu.Item>
                            Logo Here?
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                {/* We could change this to be whichever user is logged in */}
                                Hi Jenn!
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
                                <Menu.Item name='createStory' active={activeItem === 'createStory'} onClick={this.handleItemClick}>
                                    Create Story
                                </Menu.Item>
                                <Menu.Item name='removeStory' active={activeItem === 'removeStory'} onClick={this.handleItemClick}>
                                    Remove Story
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    </div>
                    {/* Changed these to divs so we can work some CSS magic on them */}
                    <div className='content'>
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
