import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import VolunteerList from './VolunteerList'
import './Stylesheets/AdminDashboard.css'

export default class AdminDashboard extends Component {
    state = {
        // Default active content
        activeItem: 'volunteerList'
    }

    handleItemClick = (e, { name }) => this.setState({activeItem: name})
    
    render() {
        const { activeItem } = this.state
        const itemsToRender = {'volunteerList': <VolunteerList />}
        return (
            <div className='adminDash'>
                    <Menu size='huge' inverted color='teal'>
                        <Menu.Item>
                            Logo Here? or Menu here?
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                {/* We could change this to be whichever user is logged in */}
                                Hi Jenn!
                            </Menu.Item>
                            <Menu.Item>
                                Logout
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                <div className='adminView'>
                    <div className='dashMenu'>
                        <Menu vertical size='huge'>
                            <Menu.Item name='events' active={activeItem === 'events'} onClick={this.handleItemClick}>
                                Events
                            </Menu.Item>
                            <Menu.Item name='volunteerList' active={activeItem === 'volunteerList'} onClick={this.handleItemClick}>
                                Volunteers
                            </Menu.Item>
                            <Menu.Item name='addImages' active={activeItem === 'addImages'} onClick={this.handleItemClick}>
                                Add Image
                            </Menu.Item>
                            <Menu.Item name='newStory' active={activeItem === 'newStory'} onClick={this.handleItemClick}>
                                New Story
                            </Menu.Item>
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
